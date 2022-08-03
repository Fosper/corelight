import { createReadStream, createWriteStream } from 'fs'
import corelight from '../'

(async () => {
    let [ me, result, options, run ] = await corelight.funcInit(`test`, { initiator: `test.js` })

    // console.log(`Function 'getType':`)
    // run = await corelight.getType({ initiator: me, stackTrace: result.stackTrace, data: 123 })
    // console.log(run)
    // console.log(`\n`)

    // console.log(`Function 'getDefaultOptions' (no hard):`)
    // options = {
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
    // run = await corelight.getDefaultOptions({ initiator: me, stackTrace: result.stackTrace, options, defaultOptions })
    // console.log(run)
    // console.log(`\n`)

    // console.log(`Function 'getDefaultOptions' (hard):`)
    // options = {
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
    // run = await corelight.getDefaultOptions({ initiator: me, stackTrace: result.stackTrace, options, defaultOptions, hard: true })
    // console.log(run)
    // console.log(`\n`)

    // console.log(`Function 'isAvailableTypes':`)
    // options = {
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
    // run = await corelight.isAvailableTypes({ initiator: me, stackTrace: result.stackTrace, options, availableTypes })
    // console.log(run)
    // console.log(`\n`)

    // console.log(`Function 'isAvailableValues':`)
    // options = {
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
    // run = await corelight.isAvailableValues({ initiator: me, stackTrace: result.stackTrace, options, availableValues })
    // console.log(run)
    // console.log(`\n`)

    // console.log(`Function 'getOptions' (no hard):`)
    // options = {
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
    // var availableTypes = {
    //     test1_1: [ `Number` ],
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
    // var availableValues = {
    //     test1_1: {
    //         min: 1,
    //         max: 1,
    //         minLength: 1,
    //         maxLength: 1
    //     },
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
    // run = await corelight.getOptions({ initiator: me, stackTrace: result.stackTrace, options, defaultOptions, availableTypes, availableValues })
    // console.log(run)
    // console.log(`\n`)

    // console.log(`Function 'getRandInt':`)
    // run = await corelight.getRandInt({ initiator: me, stackTrace: result.stackTrace, min: 0, max: 100 })
    // console.log(run)
    // console.log(`\n`)
})()