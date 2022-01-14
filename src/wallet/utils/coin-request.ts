import { NotFoundException } from '@nestjs/common';
import axios from 'axios';
import CoinDTO from 'src/dto/coin.dto';

const getConversion = async (coinFrom: string, coinTo: string): Promise<CoinDTO> => {
  const url = process.env.COIN_API_URL.replace('{coin}', `${coinFrom}-${coinTo}`);
  const response = await axios.get(url);
  if (response.status === 404) {
    throw new NotFoundException(`Conversion from ${coinFrom} to ${coinTo} not found.`);
  }
  return response.data[`${coinFrom}${coinTo}`];
};

export default getConversion;
