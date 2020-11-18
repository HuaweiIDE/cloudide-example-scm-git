/********************************************************************************
 * Copyright (C) 2020 yeweiasia All rights reserved.
 * SPDX-License-Identifier: MIT
 ********************************************************************************/

import * as cloudide from '@cloudide/plugin';
import { exposable, expose } from '@cloudide/messaging';
import { LogLevel } from '@cloudide/core/lib/common/plugin-common';
import { AbstractBackend } from '@cloudide/core/lib/node/plugin-api';
import simpleGit, { SimpleGit, SimpleGitOptions } from 'simple-git';

/**
 * Add your backend api in this class
 * Using '@expose' to expose your function to frontend
 */
@exposable
export class Backend extends AbstractBackend {

    private git?: SimpleGit;

    /**
     * function call to the backend will wait until init() to be resolved
     */
    async init(): Promise<void> {
        if (cloudide.workspace.workspaceFolders) {
            const options: SimpleGitOptions = {
                baseDir: cloudide.workspace.workspaceFolders[0].uri.path,
                binary: 'git',
                maxConcurrentProcesses: 6,
            };
            this.git = simpleGit(options);
        }
    }

    /**
     * Entry of your plugin backend
     * In this function you can call function exposed by frontend 
     */
    public async run(): Promise<void> {

    }

    public stop(): void {

    }

    /**
     * this function can be called from plugin frontend as below:
     * @example
     * ```
     * plugin.call('your_backend_function_identifier', 'world').then(ret => {
     *     console.log(ret);
     * });
     * 
     * ```
     */
    @expose('example.git.status.check')
    public async checkGitStatus(): Promise<boolean> {
        if (this.git) {
            const status = await this.git.status();
            return status.isClean();
        }
        return false;
    }

}
