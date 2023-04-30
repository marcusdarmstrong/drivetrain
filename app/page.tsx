import { Fragment } from 'react';

import DriveTrainCreator from './DriveTrainCreator';
import DriveTrainEditor from './DriveTrainEditor';
import DriveTrainViewer from './DriveTrainViewer';
import CadenceSelector from './CadenceSelector';
import { parseDrivetrain, parseCadence, realizeCadence, realizeDrivetrain } from './marshalling';

export default function Home({ searchParams }) {
  const drivetrains = (
    Array.isArray(searchParams.d) 
      ? searchParams.d 
      : ('d' in searchParams ? [searchParams.d] : [])
  )
    .map(d => parseDrivetrain(d))
    .filter(Boolean)
    .map(d => realizeDrivetrain(d));

  if (drivetrains.length === 0) {
    drivetrains.push(realizeDrivetrain({}));
  }
  // TODO: Check for redirect/throw out bad drivetrain params

  const cadence = realizeCadence(parseCadence(searchParams.c));


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
      {drivetrains.map((drivetrain, index) =>
        <div className="m-8" key={index}>
          <DriveTrainEditor drivetrain={drivetrain} index={index} />
          <DriveTrainViewer cadence={cadence} drivetrain={drivetrain} />
        </div>
      )}
    </main>
  )
}
