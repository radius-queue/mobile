import { ImageSourcePropType } from 'react-native';

export class BusinessCardInfo {

  constructor(readonly title: string,
              readonly type: string,
              readonly image: ImageSourcePropType) {
  }

  static sample (): BusinessCardInfo {
    return new BusinessCardInfo(
      'Aladdin Gyro-Cery & Deli',
      'Mediterranean restaurant',
      require('../assets/landing.jpg'),
    );
  }
}