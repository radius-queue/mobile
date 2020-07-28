import {Queue, Party} from './queue';

const TEST_PARTY : Party[] = [new Party('Russell Wilson', 3, '123-456-789', 20),
  new Party('Serena Williams', 2, '987-654-3210', 45),
  new Party('Tiger Woods', 10, '151-515-1515', 60)];

export const TEST_QUEUE : Queue = new Queue('Test', new Date(), '0', true, TEST_PARTY);


