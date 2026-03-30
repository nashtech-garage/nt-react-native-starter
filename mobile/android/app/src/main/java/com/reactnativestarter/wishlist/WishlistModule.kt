package com.reactnativestarter.wishlist

import android.content.ContentValues
import com.facebook.react.bridge.Arguments
import com.facebook.react.bridge.Promise
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReactContextBaseJavaModule
import com.facebook.react.bridge.ReactMethod
import com.facebook.react.module.annotations.ReactModule
import com.facebook.react.turbomodule.core.interfaces.TurboModule

@ReactModule(name = WishlistModule.NAME)
class WishlistModule(private val reactContext: ReactApplicationContext) :
  ReactContextBaseJavaModule(reactContext), TurboModule {

  companion object {
    const val NAME = "WishlistModule"
  }

  private val dbHelper: WishlistDbHelper by lazy { WishlistDbHelper(reactContext) }

  override fun getName(): String = NAME

  @ReactMethod
  fun getWishlistProductIds(promise: Promise) {
    try {
      val db = dbHelper.readableDatabase
      val cursor =
        db.query(
          WishlistDbHelper.TABLE_NAME,
          arrayOf(WishlistDbHelper.COLUMN_PRODUCT_ID),
          null,
          null,
          null,
          null,
          null,
        )

      val result = Arguments.createArray()
      cursor.use {
        while (it.moveToNext()) {
          result.pushInt(it.getInt(0))
        }
      }
      promise.resolve(result)
    } catch (e: Exception) {
      promise.reject("WISHLIST_READ_ERROR", e.message, e)
    }
  }

  @ReactMethod
  fun addProduct(productId: Int, promise: Promise) {
    try {
      val db = dbHelper.writableDatabase
      val values =
        ContentValues().apply {
          put(WishlistDbHelper.COLUMN_PRODUCT_ID, productId)
        }
      db.insertWithOnConflict(
        WishlistDbHelper.TABLE_NAME,
        null,
        values,
        android.database.sqlite.SQLiteDatabase.CONFLICT_IGNORE,
      )
      promise.resolve(true)
    } catch (e: Exception) {
      promise.reject("WISHLIST_ADD_ERROR", e.message, e)
    }
  }

  @ReactMethod
  fun removeProduct(productId: Int, promise: Promise) {
    try {
      val db = dbHelper.writableDatabase
      val deleted =
        db.delete(
          WishlistDbHelper.TABLE_NAME,
          "${WishlistDbHelper.COLUMN_PRODUCT_ID}=?",
          arrayOf(productId.toString()),
        )
      promise.resolve(deleted > 0)
    } catch (e: Exception) {
      promise.reject("WISHLIST_REMOVE_ERROR", e.message, e)
    }
  }
}
