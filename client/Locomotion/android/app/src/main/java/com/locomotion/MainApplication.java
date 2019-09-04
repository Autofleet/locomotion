package com.locomotion;

import android.app.Application;
import android.util.Log;

import com.facebook.react.PackageList;
import com.facebook.hermes.reactexecutor.HermesExecutorFactory;
import com.facebook.react.bridge.JavaScriptExecutorFactory;
import com.facebook.react.ReactApplication;
import fr.bamlab.rnimageresizer.ImageResizerPackage;
import com.lugg.ReactNativeConfig.ReactNativeConfigPackage;
import com.learnium.RNDeviceInfo.RNDeviceInfo;
import com.BV.LinearGradient.LinearGradientPackage;
import com.imagepicker.ImagePickerPackage;
import com.facebook.react.ReactNativeHost;
import com.facebook.react.ReactPackage;
import com.facebook.soloader.SoLoader;
import com.airbnb.android.react.maps.MapsPackage;
// import com.facebook.react.shell.MainReactPackage;

import java.util.List;

public class MainApplication extends Application implements ReactApplication {

  private final ReactNativeHost mReactNativeHost = new ReactNativeHost(this) {
    @Override
    public boolean getUseDeveloperSupport() {
      return BuildConfig.DEBUG;
    }

    @Override
    protected List<ReactPackage> getPackages() {
      @SuppressWarnings("UnnecessaryLocalVariable")
      List<ReactPackage> packages = new PackageList(this).getPackages();
      // Packages that cannot be autolinked yet can be added manually here, for example:
      // packages.add(new MyReactNativePackage());
      // packages.add(new MainReactPackage(),
      packages.add(new ImageResizerPackage());
      packages.add(new ReactNativeConfigPackage());
      packages.add(new RNDeviceInfo());
      packages.add(new LinearGradientPackage());
      packages.add(new ImagePickerPackage());
      packages.add(new MapsPackage());
      return packages;
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
    super.onCreate();
    SoLoader.init(this, /* native exopackage */ false);
  }
}
