package com.reactnativestarter.wishlist

import android.content.Context
import android.database.sqlite.SQLiteDatabase
import android.database.sqlite.SQLiteOpenHelper

class WishlistDbHelper(context: Context) :
  SQLiteOpenHelper(context, DATABASE_NAME, null, DATABASE_VERSION) {

  override fun onCreate(db: SQLiteDatabase) {
    db.execSQL(
      "CREATE TABLE $TABLE_NAME (" +
        "$COLUMN_ID INTEGER PRIMARY KEY AUTOINCREMENT," +
        "$COLUMN_PRODUCT_ID INTEGER UNIQUE NOT NULL" +
        ")",
    )
  }

  override fun onUpgrade(db: SQLiteDatabase, oldVersion: Int, newVersion: Int) {
    db.execSQL("DROP TABLE IF EXISTS $TABLE_NAME")
    onCreate(db)
  }

  companion object {
    const val DATABASE_NAME = "wishlist.db"
    const val DATABASE_VERSION = 1

    const val TABLE_NAME = "wishlist"
    const val COLUMN_ID = "id"
    const val COLUMN_PRODUCT_ID = "product_id"
  }
}
