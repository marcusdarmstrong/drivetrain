import { Fragment } from 'react';

import DriveTrainCreator from './DriveTrainCreator';
import DriveTrainEditor from './DriveTrainEditor';
import DriveTrainViewer from './DriveTrainViewer';
import CadenceSelector from './CadenceSelector';
import { Card, Spacer, Header, Box, Toolbar, Banner } from './ui';
import { type Drivetrain, parseDrivetrain, parseCadence, realizeCadence, realizeDrivetrain } from './marshalling';

export default async function Home({ searchParams }: { searchParams: Promise<{ [param: string]: string | string[] }>}) {
  const params = await searchParams;
  const drivetrains: Drivetrain[] = (
    Array.isArray(params.d) 
      ? params.d 
      : ('d' in params ? [params.d] : [])
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
      Array.isArray(params.c) ? params.c[0] : params.c
    )
  );

  return (
    <main className="m-4 min-h-screen">
      <div className="gap-2 flex flex-wrap">
        <Banner>
          <div className="flex w-full items-center gap-4 flex-wrap lg:flex-nowrap">
            <Header level="h1">
              <span className="inline-block p-2">Drivetrain calculator</span>
              <Toolbar>
                <DriveTrainCreator />
              </Toolbar>
            </Header>
            <CadenceSelector cadence={cadence} />
          </div>
        </Banner>
        {drivetrains.map((drivetrain: Drivetrain, index: number) =>
          <Card key={index}>
            <DriveTrainEditor drivetrain={drivetrain} index={index} />
            <Spacer><DriveTrainViewer cadence={cadence} drivetrain={drivetrain} /></Spacer>
          </Card>
        )}
      </div>
    </main>
  )
}
