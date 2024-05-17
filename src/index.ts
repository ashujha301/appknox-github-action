import * as core from '@actions/core';
import {cicheck, upload, whoami, sarifReport} from './tool';
import {getInputs} from './input-helper';

async function run(): Promise<void> {
  try {
    const inputs = getInputs();
    core.exportVariable('APPKNOX_ACCESS_TOKEN', inputs.appknoxAccessToken);
    await whoami();
    const fileID = await upload(inputs.filePath);
    const sarif = inputs.sarif;
    if (sarif == 'true'){
      await sarifReport(fileID);
    }
    await cicheck(inputs.riskThreshold, fileID);
  } catch (err: any) {
    if (err instanceof Error) {
      core.setFailed(err.message);
    } else {
      core.setFailed('Unknown error occurred');
    }
  }
}

run();