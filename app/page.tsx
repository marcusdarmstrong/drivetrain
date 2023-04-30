import { Fragment } from 'react';

import DriveTrainCreator from './DriveTrainCreator';
import DriveTrainEditor from './DriveTrainEditor';
import DriveTrainViewer from './DriveTrainViewer';
import CadenceSelector from './CadenceSelector';
import { type Drivetrain, parseDrivetrain, parseCadence, realizeCadence, realizeDrivetrain } from './marshalling';

export default function Home({ searchParams }: { searchParams: { [param: string]: string | string[] }}) {
  const drivetrains: Drivetrain[] = (
    Array.isArray(searchParams.d) 
      ? searchParams.d 
      : ('d' in searchParams ? [searchParams.d] : [])
  )
    .map((d: string) => parseDrivetrain(d))
    .filter(Boolean)
    // @ts-expect-error: TS isn't refinining the above filter
    .map((d: Partial<Drivetrain>) => realizeDrivetrain(d));

  if (drivetrains.length === 0) {
    drivetrains.push(realizeDrivetrain({}));
  }
  // TODO: Check for redirect/throw out bad drivetrain params

  const cadence = realizeCadence(
    parseCadence(
      Array.isArray(searchParams.c) ? searchParams.c[0] : searchParams.c
    )
  );

  return (
    <main className="m-8">
      <h1 className="text-2xl">Drivetrain calculator</h1>
      <div className="flex m-8">
        <div className="w-1/2">
          <CadenceSelector cadence={cadence} />
        </div>
        <div className="w-1/2 flex flex-row-reverse"> 
          <DriveTrainCreator />
        </div>
      </div>
      {drivetrains.map((drivetrain: Drivetrain, index: number) =>
        <div className="m-8" key={index}>
          <DriveTrainEditor drivetrain={drivetrain} index={index} />
          <DriveTrainViewer cadence={cadence} drivetrain={drivetrain} />
        </div>
      )}
    </main>
  )
}
