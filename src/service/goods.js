import request from '../utils/request';

export default class Server {

  static async QueryGoods() {
    return request('http://dev.xidianbao.xyz/api/others/interview')
  }

}
