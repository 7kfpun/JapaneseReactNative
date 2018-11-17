package com.kfpun.japanese;

import android.app.Application;

import com.AlexanderZaytsev.RNI18n.RNI18nPackage;
import com.avishayil.rnrestart.ReactNativeRestartPackage;
import com.clevertap.android.sdk.ActivityLifecycleCallback;
import com.clevertap.react.CleverTapPackage;
import com.crashlytics.android.answers.Answers;
import com.crashlytics.android.Crashlytics;
import com.dooboolab.RNIap.RNIapPackage;
import com.geektime.rnonesignalandroid.ReactNativeOneSignalPackage;
import com.learnium.RNDeviceInfo.RNDeviceInfo;
import com.oblador.vectoricons.VectorIconsPackage;
import com.smixx.fabric.FabricPackage;
import io.fabric.sdk.android.Fabric;
import io.invertase.firebase.admob.RNFirebaseAdMobPackage;
import io.invertase.firebase.config.RNFirebaseRemoteConfigPackage;
import io.invertase.firebase.analytics.RNFirebaseAnalyticsPackage;
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
            new ReactNativeOneSignalPackage(),
            new ReactNativeRestartPackage(),
            new RNDeviceInfo(),
            new RNFirebaseAdMobPackage(),
            new RNFirebaseAnalyticsPackage(),
            new RNFirebaseCrashlyticsPackage(),
            new RNFirebaseMessagingPackage(),
            new RNFirebasePackage(),
            new RNFirebasePerformancePackage(),
            new RNFirebaseRemoteConfigPackage(),
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
    super.onCreate();
  }
}
