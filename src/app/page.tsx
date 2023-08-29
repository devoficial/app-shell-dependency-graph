import Graph from "./components/Graph";

const getDepsFromMfs = async () =>
{
  const domains: { [key: string]: string } = {
    dev: 'https://app-dev-http.clear.in',
    qa: 'https://app-qa-http.clear.in',
    sandbox: 'https://app-sandbox.clear.in',
    production: 'https://app.clear.in',
  };
  const apps = [
    { appName: 'Enteprise App Shell', artifactoryPath: '' },
    { appName: 'Gst Shell', artifactoryPath: 'gst' },
    { appName: 'Gst Forms', artifactoryPath: 'gst/forms' },
    { appName: 'Gst Reports', artifactoryPath: 'gst/reports' },
    { appName: 'Clear Shell', artifactoryPath: 'max-itc' },
    {
      appName: 'Max Onboarding',
      artifactoryPath: 'max-itc/max-onboarding'
    },
    { appName: 'Max ITC', artifactoryPath: 'max-itc/itc' },
    { appName: 'ITC Utilization', artifactoryPath: 'itc/reports' },
    { appName: 'TDS', artifactoryPath: 'tds-fe' },
    { appName: 'Invoicing', artifactoryPath: 'invoicing' },
    {
      appName: 'Contact Master',
      artifactoryPath: 'contact-master',
    },
    { appName: 'Ingestion', artifactoryPath: 'ingestion' },
    { appName: 'Discounting', artifactoryPath: 'discounting' },
    { appName: 'E-Invoicing', artifactoryPath: 'einvoicing' },
    { appName: 'E-Invoicing GCC', artifactoryPath: 'gcc' },
    { appName: 'Clear IRP', artifactoryPath: 'irp' },
    { appName: 'Capture', artifactoryPath: 'clear-capture-fe' },
    { appName: 'Notice Management', artifactoryPath: 'notice-management' },
    {
      appName: 'Invoice Finance',
      artifactoryPath: 'invoice-finance-fe',
    },
    {
      appName: 'Ap International',
      artifactoryPath: 'ap-international-frontend',
    },
    { appName: 'Discounting-Admin', artifactoryPath: 'xpedize' },
    { appName: 'Accounts Payable India', artifactoryPath: 'accounts-payable' }
  ];

  const results = [];

  for (const url of apps)
  {
    try
    {
      const path = `${domains['production']}/${url.artifactoryPath === '' ? '' : `${url.artifactoryPath}/`}latest/release_metadata.json`;
      const response = await fetch(path);
      const data = await response.json();
      results.push(data);
    } catch (error)
    {
      // console.error(`Error fetching data from ${url}:`, error);
    }
  }

  return transformData(transformInputToOutput(results));
}

interface PackageJson {
  name: string; 
  dependencies?: { [key: string]: string }
}

interface Dependencies {
  [key: string]: { deps?: { [key: string]: string } };
}

function transformInputToOutput(inputArray: PackageJson[]): Dependencies {
  const appDeps: Dependencies = {};

  inputArray.forEach(item => {
      const { name, dependencies } = item;
      appDeps[name] = { deps: dependencies };
  });

  return appDeps;
}


interface TransformDependencies {
  [key: string]: string[];
}


function transformData(inputData: Dependencies): TransformDependencies {
  const transformedOutput: TransformDependencies = {};

  // Iterate through each app in the input data
  for (const appName in inputData) {
      const appDeps = inputData[appName].deps;

      // Iterate through each dependency in the app's dependencies
      for (const depName in appDeps) {
          // Initialize the array for the dependency if it doesn't exist
          if (!transformedOutput[depName]) {
              transformedOutput[depName] = [];
          }

          // Push the app's name to the array for the dependency
          transformedOutput[depName].push(appName);
      }
  }

  return transformedOutput;
}


export default async function Home ()
{
  const release_metadata = await getDepsFromMfs();

  return (
    <main className='my-5'>
      <Graph data={release_metadata} />
    </main>
  )
}