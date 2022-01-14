import { NotFoundException } from '@nestjs/common';
import axios from 'axios';
import CoinDTO from 'src/dto/coin.dto';

const getConversion = async (coinFrom: string, coinTo: string): Promise<CoinDTO> => {
  const url = process.env.COIN_API_URL.replace('{coin}', `${coinFrom}-${coinTo}`);
  try {
    const response = await axios.get(url);
    return response.data[`${coinFrom}${coinTo}`];
  } catch (error) {
    throw new NotFoundException(`Conversion from ${coinFrom} to ${coinTo} not found.`);
  }
};

export default getConversion;
