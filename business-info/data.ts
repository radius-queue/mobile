
export class BusinessInfo {
  
  constructor(readonly name: string, readonly hours: [Date | null, Date | null][],
    readonly phone: string,
    readonly queues: QueueStatus[],
    readonly coordinates: [number, number],
    readonly radius: number,
    readonly address: string) {

  }

  static sample() {
    return new BusinessInfo(
      'Aladdin Gyro-Cery & Deli',
      [1, 2, 3, 4, 5, 6, 7].map(() => [new Date(), new Date()]),
      '2817325876',
      [QueueStatus.sample()],
      [47.5403588, -122.0717116],
      200,
      '21289 SE 42nd Pl, Issaquah, WA 98029, USA'
    );
  }
};

class QueueStatus {
  constructor(readonly open: boolean, readonly length: number, readonly firstWaitTime: number) {

  };

  static sample() {
    return new QueueStatus(true, 5, 15);
  }
}

export class User {
  constructor(readonly firstName: string, readonly lastName: string, readonly phoneNumber: string) {

  };

  static sample() {
    return new User('Samuel', 'Berensohn', '281-732-5876');
  }
}