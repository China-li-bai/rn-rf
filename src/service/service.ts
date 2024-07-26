import Taro from "@tarojs/taro";
import { HTTP_STATUS } from "./status";

interface Config extends Omit<Taro.request.Option, "url"> {
  baseURL?: string;
  url?: string;
}
export class Service {
  instance: <T = any>(option: Config) => Taro.RequestTask<T>;
  config: Config | undefined;
  constructor(config?: Config) {
    this.instance = this.request();
    this.config = config;
  }
  request() {
    return Taro.request;
  }
  formatOption(config) {
    if (this.config?.baseURL) {
      const url = this.config.baseURL + config?.url;
      return {
        ...this.config,
        url,
      };
    }
    return {
      ...config,
    };
  }
  async formatResult(promise) {
    const result: Taro.request.SuccessCallbackResult<any> = await promise;
    console.log("format before", { result });
    if (result.statusCode === HTTP_STATUS.SUCCESS) {
      return result.data;
    }
    return result;
  }
  get(config: Config) {
    return this.formatResult(
      this.instance({
        ...this.config,
        ...this.formatOption(config),
        method: "GET",
      })
    );
  }
  post(config: Config) {
    return this.formatOption(
      this.instance({
        ...this.config,
        ...this.formatOption(config),
        method: "POST",
      })
    );
  }
}
