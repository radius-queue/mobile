
export class BusinessInfo {
  
  constructor(readonly name: string, readonly hours: [Date, Date][],
    readonly phone: string,
    readonly queues: string[],
    readonly coordinates: [number, number],
    readonly radius: number,
    readonly address: string) {

  }

  static sample() {
    return new BusinessInfo(
      'Aladdin Gyro-Cery & Deli',
      [1, 2, 3, 4, 5, 6, 7].map(() => [new Date(), new Date()]),
      '281-732-5876',
      ['sample-queue'],
      [47.569887, 122.055252],
      50,
      '21289 SE 42nd Pl, Issaquah, WA 98029, USA'
    );
  }
}