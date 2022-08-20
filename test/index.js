import { createReadStream, createWriteStream } from 'fs'
import corelight from '../'
import { resolve } from 'dns';

const folderName = `test`
const self = `${folderName}->test.js`;

(async (...opt) => {
    let func = corelight.func.init(self, opt, `Run`, 1)
    let run

    // console.log(`Function 'getType':`)
    // var options = 123
    // run = corelight.getType(func, options)
    // console.log(run)
    // console.log(`\n`)
    // run = corelight.getType(func, options, { dumpLevel: 3, dumpFunc: console.log })
    // console.log(run)
    // console.log(`\n`)

    // console.log(`Function 'try':`)
    // var options = { data: () => {} }
    // run = await corelight.try(func, options)
    // console.log(run)
    // console.log(`\n`)

    // console.log(`Function 'getDefaultOptions' (no overwrite):`)
    // var options = {
    //     test1_1: undefined,
    //     test1_2: true,
    //     test1_3: 1,
    //     test1_4: `/etc/hostname`,
    //     test1_5: Symbol(`a`),
    //     test1_6: null,
    //     test1_7: { test2_1: `test` },
    //     test1_9: createReadStream(`/etc/hostname`),
    //     test1_10: createWriteStream(`/etc/hostname`),
    //     test1_11: () => {}
    // }
    // var defaultOptions = {
    //     test1_1: 1,
    //     test1_2: false,
    //     test1_3: 1,
    //     test1_4: `/etc/hostname`,
    //     test1_5: Symbol(`a`),
    //     test1_6: null,
    //     test1_7: { test2_1: `test_test`, test2_2: `test_test` },
    //     test1_8: [ `test1`, `test2` ],
    //     test1_9: `test`,
    //     test1_10: createWriteStream(`/etc/hostname`),
    //     test1_11: () => {}
    // }
    // run = await corelight.getDefaultOptions(func, options, defaultOptions)
    // console.log(run)
    // console.log(`\n`)

    // console.log(`Function 'getDefaultOptions' (overwrite):`)
    // var options = {
    //     test1_1: undefined,
    //     test1_2: true,
    //     test1_3: 1,
    //     test1_4: `/etc/hostname`,
    //     test1_5: Symbol(`a`),
    //     test1_6: null,
    //     test1_7: { test2_1: `test` },
    //     test1_9: createReadStream(`/etc/hostname`),
    //     test1_10: createWriteStream(`/etc/hostname`),
    //     test1_11: () => {}
    // }
    // var defaultOptions = {
    //     test1_1: 1,
    //     test1_2: false,
    //     test1_3: 1,
    //     test1_4: `/etc/hostname`,
    //     test1_5: Symbol(`a`),
    //     test1_6: null,
    //     test1_7: { test2_1: `test_test`, test2_2: `test_test` },
    //     test1_8: [ `test1`, `test2` ],
    //     test1_9: `test`,
    //     test1_10: createWriteStream(`/etc/hostname`),
    //     test1_11: () => {}
    // }
    // run = await corelight.getDefaultOptions(func, options, defaultOptions, true)
    // console.log(run)
    // console.log(`\n`)

    // console.log(`Function 'isAvailableTypes' (no fullMatch):`)
    // var options = {
    //     test1_1: undefined,
    //     test1_2: true,
    //     test1_3: 1,
    //     test1_4: `/etc/hostname`,
    //     test1_5: Symbol(`a`),
    //     test1_6: null,
    //     test1_7: { test2_1: `test` },
    //     test1_8: [ `test1`, `test2` ],
    //     test1_9: createReadStream(`/etc/hostname`),
    //     test1_10: createWriteStream(`/etc/hostname`),
    //     test1_11: () => {}
    // }
    // var availableTypes = {
    //     test1_1: [ `Undefined` ],
    //     test1_2: [ `Boolean` ],
    //     test1_3: [ `Number` ],
    //     test1_4: [ `String` ],
    //     test1_5: [ `Symbol` ],
    //     test1_6: [ `Null` ],
    //     test1_7: { test2_1: [ `String`] },
    //     test1_8: [ `Array` ],
    //     test1_9: [ `Readable` ],
    //     test1_10: [ `Writable` ],
    //     test1_11: [ `Function` ],
    // }
    // run = await corelight.isAvailableTypes(func, options, availableTypes, true)
    // console.log(run)
    // console.log(`\n`)

    // console.log(`Function 'isAvailableValues':`)
    // var options = {
    //     test1_1: undefined,
    //     test1_2: true,
    //     test1_3: 1,
    //     test1_4: `/etc/hostname`,
    //     test1_5: Symbol(`a`),
    //     test1_6: null,
    //     test1_7: { test2_1: `test` },
    //     test1_8: [ `test1`, `test2` ],
    //     test1_9: createReadStream(`/etc/hostname`),
    //     test1_10: createWriteStream(`/etc/hostname`),
    //     test1_11: () => {}
    // }
    // var availableValues = {
    //     test1_2: {
    //         values: [ true ]
    //     },
    //     test1_3: {
    //         min: 1,
    //         max: 1,
    //         minLength: 1,
    //         maxLength: 1,
    //         values: [ 1 ]
    //     },
    //     test1_4: {
    //         minLength: 13,
    //         maxLength: 13,
    //         values: [ `/etc/hostname` ],
    //         existPath: true
    //     },
    //     test1_6: {
    //         values: [ null ]
    //     },
    //     test1_7: {
    //         test2_1: {
    //             minLength: 4,
    //             maxLength: 4,
    //             values: [ `test` ]
    //         }
    //     },
    //     test1_8: {
    //         minLength: 2,
    //         maxLength: 2
    //     }
    // }
    // run = await corelight.isAvailableValues(func, options, availableValues)
    // console.log(run)
    // console.log(`\n`)

    // console.log(`Function 'try' (without errors):`)
    // run = await corelight.try(func, () => { return 123 })
    // console.log(run)
    // console.log(`\n`)

    // console.log(`Function 'try' (with errors):`)
    // run = await corelight.try(func, () => { throw(`Error message`) })
    // console.log(run)
    // console.log(`\n`)

    // console.log(`Function 'getRandInt':`)
    // run = await corelight.getRandInt(func)
    // console.log(run)
    // console.log(`\n`)
})()