package com.kfpun.nihongo;

import android.app.Application;

import co.apptailor.googlesignin.RNGoogleSigninPackage;
import com.AlexanderZaytsev.RNI18n.RNI18nPackage;
import com.avishayil.rnrestart.ReactNativeRestartPackage;
import com.clevertap.android.sdk.ActivityLifecycleCallback;
import com.clevertap.react.CleverTapPackage;
import com.crashlytics.android.answers.Answers;
import com.crashlytics.android.Crashlytics;
import com.dooboolab.RNIap.RNIapPackage;
import com.facebook.appevents.AppEventsLogger;
import com.facebook.CallbackManager;
import com.facebook.reactnative.androidsdk.FBSDKPackage;
import com.geektime.rnonesignalandroid.ReactNativeOneSignalPackage;
import com.learnium.RNDeviceInfo.RNDeviceInfo;
import com.oblador.vectoricons.VectorIconsPackage;
import com.smixx.fabric.FabricPackage;
import io.branch.referral.Branch;
import io.branch.rnbranch.RNBranchPackage;
import io.fabric.sdk.android.Fabric;
import io.invertase.firebase.admob.RNFirebaseAdMobPackage;
import io.invertase.firebase.analytics.RNFirebaseAnalyticsPackage;
import io.invertase.firebase.auth.RNFirebaseAuthPackage;
import io.invertase.firebase.config.RNFirebaseRemoteConfigPackage;
import io.invertase.firebase.fabric.crashlytics.RNFirebaseCrashlyticsPackage;
import io.invertase.firebase.messaging.RNFirebaseMessagingPackage;
import io.invertase.firebase.perf.RNFirebasePerformancePackage;
import io.invertase.firebase.RNFirebasePackage;
import net.no_mad.tts.TextToSpeechPackage;

import com.facebook.react.ReactApplication;
import com.facebook.react.ReactNativeHost;
import com.facebook.react.ReactPackage;
import com.facebook.react.shell.MainReactPackage;
import com.facebook.soloader.SoLoader;

import java.util.Arrays;
import java.util.List;

public class MainApplication extends Application implements ReactApplication {

  // Facebook SDK
  private static CallbackManager mCallbackManager = CallbackManager.Factory.create();
  protected static CallbackManager getCallbackManager() {
    return mCallbackManager;
  }

  private final ReactNativeHost mReactNativeHost = new ReactNativeHost(this) {
    @Override
    public boolean getUseDeveloperSupport() {
      return BuildConfig.DEBUG;
    }

    @Override
    protected List<ReactPackage> getPackages() {
        return Arrays.<ReactPackage>asList(
            new MainReactPackage(),
            new CleverTapPackage(),
            new FabricPackage(),
            new FBSDKPackage(mCallbackManager),
            new ReactNativeOneSignalPackage(),
            new ReactNativeRestartPackage(),
            new RNBranchPackage(),
            new RNDeviceInfo(),
            new RNFirebaseAdMobPackage(),
            new RNFirebaseAnalyticsPackage(),
            new RNFirebaseAuthPackage(),
            new RNFirebaseCrashlyticsPackage(),
            new RNFirebaseMessagingPackage(),
            new RNFirebasePackage(),
            new RNFirebasePerformancePackage(),
            new RNFirebaseRemoteConfigPackage(),
            new RNGoogleSigninPackage(),
            new RNI18nPackage(),
            new RNIapPackage(),
            new TextToSpeechPackage(),
            new VectorIconsPackage()
        );
    }

    @Override
    protected String getJSMainModuleName() {
      return "index";
    }
  };

  @Override
  public ReactNativeHost getReactNativeHost() {
    return mReactNativeHost;
  }

  @Override
  public void onCreate() {
    Fabric.with(this, new Crashlytics(), new Answers());
    SoLoader.init(this, /* native exopackage */ false);
    ActivityLifecycleCallback.register(this);

    // Initialize the Branch object
    Branch.getAutoInstance(this);

    super.onCreate();

    // Facebook SDK
    AppEventsLogger.activateApp(this);
  }
}
