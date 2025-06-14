import { app } from 'electron'
import { Kysely, SqliteDialect, sql } from 'kysely'
import SQLite from 'better-sqlite3'
import { join } from 'path'
import { Person, PersonUpdate, NewPerson } from './types'
import { Database } from './types'

export async function Do() {
  const db = new Kysely<Database>({
    dialect: new SqliteDialect({ database: new SQLite(getPath()) })
  })

  try {
    await up(db)
    console.log('Database initialized successfully')
  } catch (error) {
    console.error('Error initializing database:', error)
  }

  const person: NewPerson = {
    first_name: 'John',
    gender: 'man',
    last_name: 'Doe',
    created_at: new Date().toISOString()
  }
  const createdPerson = await createPerson(db, person)
  console.log('Created Person:', createdPerson)

  const foundPerson = await findPersonById(db, createdPerson.id)
  console.log('Found Person:', foundPerson)

  const updateData: PersonUpdate = { last_name: 'Smith' }
  await updatePerson(db, createdPerson.id, updateData)

  console.log('Updated Person:', await findPersonById(db, createdPerson.id))

  const deletedPerson = await deletePerson(db, createdPerson.id)
  console.log('Deleted Person:', deletedPerson)

  const shouldBeUndefined = await findPersonById(db, createdPerson.id)
  console.log('Should be undefined:', shouldBeUndefined)

  try {
    await down(db)
    console.log('Database rolled back successfully')
  } catch (error) {
    console.error('Error rolling back database:', error)
  }
}

export function getPath(): string {
  console.log(join(app.getPath('userData'), 'db.sqlite'))
  return join(app.getPath('userData'), 'db.sqlite')
}

export async function up(db: Kysely<Database>): Promise<void> {
  await db.schema
    .createTable('person')
    .addColumn('id', 'integer', (col) => col.primaryKey())
    .addColumn('first_name', 'text', (col) => col.notNull())
    .addColumn('last_name', 'text')
    .addColumn('gender', 'text', (col) => col.notNull())
    .addColumn('created_at', 'text', (col) => col.defaultTo(sql`CURRENT_TIMESTAMP`).notNull())
    .execute()

  await db.schema
    .createTable('pet')
    .addColumn('id', 'integer', (col) => col.primaryKey())
    .addColumn('name', 'text', (col) => col.notNull().unique())
    .addColumn('owner_id', 'integer', (col) =>
      col.references('person.id').onDelete('cascade').notNull()
    )
    .addColumn('species', 'text', (col) => col.notNull())
    .execute()

  await db.schema.createIndex('pet_owner_id_index').on('pet').column('owner_id').execute()
}

export async function down(db: Kysely<Database>): Promise<void> {
  await db.schema.dropTable('pet').execute()
  await db.schema.dropTable('person').execute()
}

export async function findPersonById(
  db: Kysely<Database>,
  id: number
): Promise<Person | undefined> {
  return await db.selectFrom('person').where('id', '=', id).selectAll().executeTakeFirst()
}

export async function updatePerson(db: Kysely<Database>, id: number, updateWith: PersonUpdate) {
  await db.updateTable('person').set(updateWith).where('id', '=', id).execute()
}

export async function createPerson(db: Kysely<Database>, person: NewPerson) {
  return await db.insertInto('person').values(person).returningAll().executeTakeFirstOrThrow()
}

export async function deletePerson(db: Kysely<Database>, id: number) {
  return await db.deleteFrom('person').where('id', '=', id).returningAll().executeTakeFirst()
}
