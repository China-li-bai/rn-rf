class AsyncSingleton {
  private static instance: Promise<AsyncSingleton>;

  private constructor() {
    // 私有构造函数，防止直接实例化
  }

  // 异步获取单例实例
  public static async getInstance(): Promise<AsyncSingleton> {
    if (!AsyncSingleton.instance) {
      AsyncSingleton.instance = (async () => {
        const instance = new AsyncSingleton();
        await instance.initialize(); // 假设有异步初始化操作
        return instance;
      })();
    }
    return AsyncSingleton.instance;
  }

  // 假设的异步初始化操作
  private async initialize() {
    // 例如：连接数据库、读取文件等
    console.log('Initializing...');
    return new Promise(resolve => setTimeout(resolve, 2000)); // 模拟异步操作
  }}