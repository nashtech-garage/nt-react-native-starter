package com.reactnativestarter.biometric

import androidx.biometric.BiometricManager
import androidx.biometric.BiometricPrompt
import androidx.core.content.ContextCompat
import androidx.fragment.app.FragmentActivity
import com.facebook.react.bridge.Promise
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReactContextBaseJavaModule
import com.facebook.react.bridge.ReactMethod
import com.facebook.react.module.annotations.ReactModule
import com.facebook.react.turbomodule.core.interfaces.TurboModule

@ReactModule(name = BiometricModule.NAME)
class BiometricModule(private val reactContext: ReactApplicationContext) :
  ReactContextBaseJavaModule(reactContext), TurboModule {

  companion object {
    const val NAME = "BiometricModule"
  }

  private var pendingPromise: Promise? = null

  override fun getName(): String = NAME

  @ReactMethod
  fun isAvailable(promise: Promise) {
    val manager = BiometricManager.from(reactContext)
    val status = manager.canAuthenticate(BiometricManager.Authenticators.BIOMETRIC_WEAK)
    promise.resolve(status == BiometricManager.BIOMETRIC_SUCCESS)
  }

  @ReactMethod
  fun authenticate(reason: String, promise: Promise) {
    val activity = currentActivity
    if (activity !is FragmentActivity) {
      promise.reject("NO_ACTIVITY", "Biometric auth requires an active FragmentActivity.")
      return
    }

    if (pendingPromise != null) {
      promise.reject("IN_PROGRESS", "Biometric authentication is already in progress.")
      return
    }

    val manager = BiometricManager.from(reactContext)
    val status = manager.canAuthenticate(BiometricManager.Authenticators.BIOMETRIC_WEAK)
    if (status != BiometricManager.BIOMETRIC_SUCCESS) {
      promise.reject("NOT_AVAILABLE", "Biometric authentication is not available on this device.")
      return
    }

    pendingPromise = promise

    val executor = ContextCompat.getMainExecutor(reactContext)
    val callback =
      object : BiometricPrompt.AuthenticationCallback() {
        override fun onAuthenticationSucceeded(result: BiometricPrompt.AuthenticationResult) {
          pendingPromise?.resolve(true)
          pendingPromise = null
        }

        override fun onAuthenticationError(errorCode: Int, errString: CharSequence) {
          pendingPromise?.reject("AUTH_ERROR", errString.toString())
          pendingPromise = null
        }

        override fun onAuthenticationFailed() {
          // Keep prompt open; user can retry without failing promise immediately.
        }
      }

    val prompt =
      BiometricPrompt(activity, executor, callback)

    val promptInfo =
      BiometricPrompt.PromptInfo.Builder()
        .setTitle("Biometric Sign In")
        .setSubtitle(reason)
        .setNegativeButtonText("Cancel")
        .build()

    prompt.authenticate(promptInfo)
  }
}
