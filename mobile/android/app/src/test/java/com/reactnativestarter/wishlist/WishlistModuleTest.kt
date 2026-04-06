package com.reactnativestarter.wishlist

import android.app.Application
import android.content.Context
import android.database.Cursor
import androidx.test.core.app.ApplicationProvider
import com.facebook.react.bridge.Promise
import com.facebook.react.bridge.ReactApplicationContext
import org.junit.Assert.assertEquals
import org.junit.Before
import org.junit.Test
import org.junit.runner.RunWith
import org.mockito.Mockito.mock
import org.mockito.Mockito.verify
import org.robolectric.RobolectricTestRunner
import org.robolectric.annotation.Config

@RunWith(RobolectricTestRunner::class)
@Config(application = Application::class)
class WishlistModuleTest {
  private lateinit var appContext: Context
  private lateinit var module: WishlistModule
  private lateinit var dbHelper: WishlistDbHelper

  @Before
  fun setUp() {
    appContext = ApplicationProvider.getApplicationContext()
    appContext.deleteDatabase(WishlistDbHelper.DATABASE_NAME)
    module = WishlistModule(ReactApplicationContext(appContext))
    dbHelper = WishlistDbHelper(appContext)
  }

  @Test
  fun addProduct_insertsRowsInDatabase() {
    module.addProduct(101, mock(Promise::class.java))
    module.addProduct(202, mock(Promise::class.java))
    assertEquals(2, countRows())
  }

  @Test
  fun addDuplicateProduct_keepsSingleRowInDatabase() {
    module.addProduct(77, mock(Promise::class.java))
    module.addProduct(77, mock(Promise::class.java))
    assertEquals(1, countRows())
  }

  @Test
  fun removeProduct_returnsTrueWhenDeletedAndFalseWhenMissing() {
    module.addProduct(8, mock(Promise::class.java))

    val deletePromise = mock(Promise::class.java)
    module.removeProduct(8, deletePromise)
    verify(deletePromise).resolve(true)

    val missingPromise = mock(Promise::class.java)
    module.removeProduct(8, missingPromise)
    verify(missingPromise).resolve(false)
  }

  private fun countRows(): Int {
    val db = dbHelper.readableDatabase
    val cursor: Cursor =
      db.query(
        WishlistDbHelper.TABLE_NAME,
        arrayOf(WishlistDbHelper.COLUMN_ID),
        null,
        null,
        null,
        null,
        null,
      )
    cursor.use {
      return it.count
    }
  }
}
