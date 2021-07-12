import { AxiosError } from 'axios';
import { NaverClient, LoginPacket } from './index';

var client = new NaverClient('naijun0403@naver.com', 'dnflwlq01')

client.login().then(() => {
    console.log('success!');
}).catch((err: AxiosError) => {
    console.error(err);
})