import path from "path";

const config = {
  projectName: "rn-rf",
  date: "2024-7-17",
  designWidth: 750,
  deviceRatio: {
    640: 2.34 / 2,
    750: 1,
    828: 1.81 / 2,
  },
  sourceRoot: "src",
  outputRoot: "dist",
  alias: {
    components: path.resolve(__dirname, "..", "src/components"),
    mock: path.resolve(__dirname, "..", "src/mock"),
    service: path.resolve(__dirname, "..", "src/service"),
    lib: path.resolve(__dirname, "..", "src/lib"),
  },
  plugins: [],

  defineConstants: {},
  copy: {
    patterns: [],
    options: {},
  },
  framework: "react",
  compiler: {
    prebundle: {
      enable: false,
    },
    type: "webpack5",
  },
  cache: {
    enable: true, // Webpack 持久化缓存配置，建议开启。默认配置请参考：https://docs.taro.zone/docs/config-detail#cache
  },
  webpackChain(chain, webpack) {
    // module: {
    //   rules: [{ test: /\.wasm$/, type: "javascript/auto" }],
    // },
    // experiments: {
    //   asyncWebAssembly: true, // 启用异步WebAssembly实验功能
    // },
  },
  mini: {
    postcss: {
      pxtransform: {
        enable: true,
        config: {},
      },
      url: {
        enable: true,
        config: {
          limit: 1024, // 设定转换尺寸上限
        },
      },
      cssModules: {
        enable: false, // 默认为 false，如需使用 css modules 功能，则设为 true
        config: {
          namingPattern: "module", // 转换模式，取值为 global/module
          generateScopedName: "[name]__[local]___[hash:base64:5]",
        },
      },
    },
  },
  h5: {
    publicPath: "/",
    staticDirectory: "static",
    environment: {
      asyncFunction: true,
    },
    webpackChain: (config, webpack) => {
      config.merge({
      //   extensions: [".dev.js", ".js", ".json", ".wasm"],
      //   fallback: {
      //     crypto: false,
      //     path: false,
      //     fs: false,
      //   },
      //   module: {
      //     rules: [
      //       // { test: /\.wasm$/, type: "javascript/auto" },
      //       // {
      //       //   test: /\/worker\.js$/,
      //       //   use: { loader: "worker-loader" },
      //       // },
      //     ],
      //   },
      //   experiments: {
      //     asyncWebAssembly: true, // 启用异步WebAssembly实验功能
      //   },
        // plugins: [
        //   new HtmlWebpackplugins({  // 无法覆盖自带的
        //     inject: true,
        //     hash: true,
        //     TARO_BASE_URL: JSON.parse(env.env.H5_URL),
        //     minify: process.env.NODE_ENV === 'production' ? {
        //       removeComments: true, // 移除属性的双引号
        //       collapseWhitespace: true, // 移除空格
        //       removeAttributeQuotes: true,
        //     } : false,
        //   }),
        // ],
        // optimization: {
        //   splitChunks: {
        //     chunks: "all", // ：表示从哪些chunks里面抽取代码，除了三个可选字符串值 initial、async、all 之外，还可以通过函数来过滤所需的 chunks；
        //     minSize: 30000, // 表示抽取出来的文件在压缩前的最小大小，默认为 30000；
        //     maxSize: 100000, // 表示抽取出来的文件在压缩前的最大大小，默认为 0，表示不限制最大大小；
        //     minChunks: 2, // 表示被引用次数，默认为1；配置commons中minChunks为2，表示将被多次引用的代码抽离成commons。
        //     maxAsyncRequests: 5, // 最大的按需(异步)加载次数，默认为 5；
        //     maxInitialRequests: 3, // 最大的初始化加载次数，默认为 3；
        //     // automaticNameDelimiter: '~', // 抽取出来的文件的自动生成名字的分割符，默认为 ~；
        //     // name: true, // 抽取出来文件的名字，默认为 true，表示自动生成文件名；
        //     cacheGroups: {
        //       vendors: {
        //         test: /[\\/]node_modules[\\/]/,
        //         priority: -10
        //       },
        //       default: {
        //         minChunks: 2,
        //         priority: -20,
        //         reuseExistingChunk: true
        //       }
        //     }
        //   }
        // }
      });
    },
    postcss: {
      autoprefixer: {
        enable: true,
        config: {},
      },
      cssModules: {
        enable: false, // 默认为 false，如需使用 css modules 功能，则设为 true
        config: {
          namingPattern: "module", // 转换模式，取值为 global/module
          generateScopedName: "[name]__[local]___[hash:base64:5]",
        },
      },
    },
  },
  rn: {
    appName: "taroDemo",
    entry: "app",
    output: {
      ios: "./ios/main.jsbundle",
      iosAssetsDest: "./ios",
      android: "./android/app/src/main/assets/index.android.bundle",
      androidAssetsDest: "./android/app/src/main/res",
      // iosSourceMapUrl: '',
      iosSourcemapOutput: "./ios/main.map",
      // iosSourcemapSourcesRoot: '',
      // androidSourceMapUrl: '',
      androidSourcemapOutput: "./android/app/src/main/assets/index.android.map",
      // androidSourcemapSourcesRoot: '',
    },
    postcss: {
      cssModules: {
        enable: false, // 默认为 false，如需使用 css modules 功能，则设为 true
      },
    },
  },
};

module.exports = function (merge) {
  if (process.env.NODE_ENV === "development") {
    return merge({}, config, require("./dev"));
  }
  return merge({}, config, require("./prod"));
};
