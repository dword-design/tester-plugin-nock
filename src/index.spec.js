import { endent } from '@dword-design/functions'
import tester from '@dword-design/tester'
import testerPluginTmpDir from '@dword-design/tester-plugin-tmp-dir'
import packageName from 'depcheck-package-name'
import { execaCommand } from 'execa'
import fs from 'fs-extra'

export default tester(
  {
    'multiple calls': async () => {
      await fs.outputFile(
        'index.spec.js',
        endent`
          import nock from 'nock'
          import { expect } from 'expect'
          import axios from '${packageName`axios`}'
          
          export default {
            1: async () => {
              nock('http://example.com').get('/').reply(200, 'foo')
              expect((await axios.get('http://example.com')).data).toEqual('foo')
            },
            2: () => expect(axios.get('http://example.com')).rejects.toThrow('Nock: No match for request'),
          }
    `
      )
      await execaCommand('mocha --ui exports index.spec.js')
    },
  },
  [
    testerPluginTmpDir(),
    {
      beforeEach: () =>
        fs.outputFile('package.json', JSON.stringify({ type: 'module' })),
    },
  ]
)
