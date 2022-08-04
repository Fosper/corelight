import { existsSync } from 'fs'
import { Readable, Writable } from 'stream'

export default class {
    static me = `corelight`
    static utc = 0

    static funcInit = (me = `Unknown`, opt = {}, self = false) => {
        return new Promise(async (resolve) => {
            if (Object.prototype.toString.call(me) !== `[object String]`) me = `Unknown`
            if (Object.prototype.toString.call(opt.initiator) !== `[object String]`) opt.initiator = `Unknown`
            if (Object.prototype.toString.call(opt.stackTrace) !== `[object Array]`) opt.stackTrace = []
            me = `${opt.initiator}->${me}`
            if (!self) opt.stackTrace.push(`${me}: Started.`)
            let result = { data: null, error: null, stackTrace: opt.stackTrace }
            let options = {}
            for (const optionsName in opt) {
                if (optionsName === `initiator` || optionsName === `stackTrace`) continue
                options[optionsName] = opt[optionsName]
            }

            resolve([ me, result, options, null ])
            return
        })
    }

    static funcError = (opt = {}) => {
        let result = { data: null, error: {}, stackTrace: opt.result.stackTrace }
        if (opt.run) {
            result.error.code = opt.run.error.code
            result.error.message = opt.run.error.message
        } else {
            result.error.code = opt.code
            result.error.message = opt.message
        }
        result.stackTrace.push(`${opt.me}: Error code: ${result.error.code}. Error message: ${result.error.message}`)
        return result
    }

    static funcSuccess = (opt = {}, self = false) => {
        let result = { data: null, error: null, stackTrace: opt.result.stackTrace }
        if (opt.run) {
            result.data = opt.run.data
        } else {
            result.data = opt.data
        }

        if (!self) {
            let dataType = Object.prototype.toString.call(result.data).replace(`[object `, ``).replace(`]`, ``)
            let availableTypesToString = [ `Undefined`, `Boolean`, `Number`, `String`, `Null` ]

            if (availableTypesToString.includes(dataType)) {
                result.stackTrace.push(`${opt.me}: Data type: ${dataType}. Data: ${result.data.toString()}.`)
            } else if (result.data instanceof Readable) {
                result.stackTrace.push(`${opt.me}: Data type: Readable. Path: ${result.data.path}.`)
            } else if (result.data instanceof Writable) {
                result.stackTrace.push(`${opt.me}: Data type: Writable. Path: ${result.data.path}.`)
            } else if (dataType === `Object`) {
                result.stackTrace.push(`${opt.me}: Data type: ${dataType}. Data: ${JSON.stringify(result.data)}`)
            } else {
                result.stackTrace.push(`${opt.me}: Data type: ${dataType}.`)
            }
            result.stackTrace.push(`${opt.me}: Success.`)
        }
        return result
    }

    /**
     * @param {string} opt.initiator - Default: 'Unknown'
     * @param {array} opt.stackTrace - Default: []
     * @param {any} opt.data - Default: undefined
     * 
     * @returns {promise}
     */
    static getType = (opt = {}) => {
        return new Promise(async (resolve) => {
            let [ me, result, options, run ] = await this.funcInit(`${this.me}->getType`, opt, true)
            let type = Object.prototype.toString.call(options.data).replace(`[object `, ``).replace(`]`, ``)

            resolve(this.funcSuccess({ me, result, data: type }, true ))
            return
        })
    }

    /**
     * @param {string} opt.initiator - Default: 'Unknown'
     * @param {array} opt.stackTrace - Default: []
     * @param {object} opt.options - Default: {}
     * @param {object} opt.defaultOptions - Default: {}
     * @param {boolean} opt.hard - Default: false
     * 
     * @returns {promise}
     */
    static getDefaultOptions = (opt = {}) => {
        return new Promise(async (resolve) => {
            let [ me, result, options, run ] = await this.funcInit(`${this.me}->getDefaultOptions`, opt, true)
            
            run = await this.getType({ initiator: me, stackTrace: result.stackTrace, data: options.options  })
            result.stackTrace = run.stackTrace
            if (run.error) {
                resolve(this.funcError({ me, result, run }))
                return
            }
            if (run.data !== `Object`) {
                options.options = {}
            }

            run = await this.getType({ initiator: me, stackTrace: result.stackTrace, data: options.defaultOptions })
            result.stackTrace = run.stackTrace
            if (run.error) {
                resolve(this.funcError({ me, result, run }))
                return
            }
            if (run.data !== `Object`) {
                options.defaultOptions = {}
            }

            run = await this.getType({ initiator: me, stackTrace: result.stackTrace, data: options.hard })
            result.stackTrace = run.stackTrace
            if (run.error) {
                resolve(this.funcError({ me, result, run }))
                return
            }
            if (run.data !== `Boolean`) {
                options.hard = false
            }

            let newOptions = options.defaultOptions
            for (const optionName in options.options) {
                let optionValue = options.options[optionName]
                run = await this.getType({ initiator: me, stackTrace: result.stackTrace, data: optionValue  })
                result.stackTrace = run.stackTrace
                if (run.error) {
                    resolve(this.funcError({ me, result, run }))
                    return
                }
                let optionValueType = run.data

                let defaultOptionValue = options.defaultOptions[optionName]
                run = await this.getType({ initiator: me, stackTrace: result.stackTrace, data: defaultOptionValue  })
                result.stackTrace = run.stackTrace
                if (run.error) {
                    resolve(this.funcError({ me, result, run }))
                    return
                }
                let defaultOptionValueType = run.data

                if (optionValueType === `Object` && !(optionValue instanceof Readable) && !(optionValue instanceof Writable)) {
                    run = await this.getDefaultOptions({ initiator: me, stackTrace: result.stackTrace, options: optionValue, defaultOptions: defaultOptionValue, hard: options.hard })
                    result.stackTrace = run.stackTrace
                    if (run.error) {
                        resolve(this.funcError({ me, result, run }))
                        return
                    }
                    newOptions[optionName] = run.data
                    continue
                }

                if (options.hard) {
                    if (defaultOptionValueType !== `Undefined`) {
                        newOptions[optionName] = defaultOptionValue
                        continue
                    }
                }
                if (optionValueType === `Undefined` && defaultOptionValueType !== `Undefined`) {
                    newOptions[optionName] = defaultOptionValue
                } else {
                    newOptions[optionName] = optionValue
                }
            }

            resolve(this.funcSuccess({ me, result, data: newOptions }, true ))
            return
        })
    }

    /**
     * @param {string} opt.initiator - Default: 'Unknown'
     * @param {array} opt.stackTrace - Default: []
     * @param {object} opt.options - Default: {}
     * @param {object} opt.availableTypes - Default: {}
     * 
     * @returns {promise}
     */
    static isAvailableTypes = (opt = {}) => {
        return new Promise(async (resolve) => {
            let [ me, result, options, run ] = await this.funcInit(`${this.me}->isAvailableTypes`, opt, true)

            run = await this.getType({ initiator: me, stackTrace: result.stackTrace, data: options.options })
            result.stackTrace = run.stackTrace
            if (run.error) {
                resolve(this.funcError({ me, result, run }))
                return
            }
            if (run.data !== `Object`) {
                options.options = {}
            }

            run = await this.getType({ initiator: me, stackTrace: result.stackTrace, data: options.availableTypes })
            result.stackTrace = run.stackTrace
            if (run.error) {
                resolve(this.funcError({ me, result, run }))
                return
            }
            if (run.data !== `Object`) {
                options.availableTypes = {}
            }

            for (const optionName in options.options) {
                let optionValue = options.options[optionName]
                run = await this.getType({ initiator: me, stackTrace: result.stackTrace, data: options.options[optionName] })
                result.stackTrace = run.stackTrace
                if (run.error) {
                    resolve(this.funcError({ me, result, run }))
                    return
                }
                let optionValueType = run.data

                let availableTypesValue = options.availableTypes[optionName]
                run = await this.getType({ initiator: me, stackTrace: result.stackTrace, data: availableTypesValue })
                result.stackTrace = run.stackTrace
                if (run.error) {
                    resolve(this.funcError({ me, result, run }))
                    return
                }
                let availableTypesValueType = run.data

                if (optionValueType === `Object` && !(optionValue instanceof Readable) && !(optionValue instanceof Writable)) {
                    run = await this.isAvailableTypes({ initiator: me, stackTrace: result.stackTrace, options: optionValue, availableTypes: availableTypesValue })
                    result.stackTrace = run.stackTrace
                    if (run.error) {
                        resolve(this.funcError({ me, result, run }))
                        return
                    }
                    if (!run.data) {
                        resolve(this.funcSuccess({ me, result, data: false }, true ))
                        return
                    }
                    continue
                }
                if (availableTypesValueType !== `Array`) {
                    availableTypesValue = []
                }
                if (!availableTypesValue.length) {
                    continue
                }
                if (availableTypesValue.includes(optionValueType)) {
                    continue
                }
                if (optionValue instanceof Readable && availableTypesValue.includes(`Readable`)) {
                    continue
                }
                if (optionValue instanceof Writable && availableTypesValue.includes(`Writable`)) {
                    continue
                }
                resolve(this.funcSuccess({ me, result, data: false }, true ))
                return
            }

            resolve(this.funcSuccess({ me, result, data: true }, true ))
            return
        })
    }

    /**
     * @param {string} opt.initiator - Default: 'Unknown'
     * @param {array} opt.stackTrace - Default: []
     * @param {object} opt.options - Default: {}
     * @param {object} opt.availableValues - Default: {}
     * 
     * @returns {promise}
     */
    static isAvailableValues = (opt = {}) => {
        return new Promise(async (resolve) => {
            let [ me, result, options, run ] = await this.funcInit(`${this.me}->isAvailableValues`, opt, true)

            run = await this.getType({ initiator: me, stackTrace: result.stackTrace, data: options.options })
            result.stackTrace = run.stackTrace
            if (run.error) {
                resolve(this.funcError({ me, result, run }))
                return
            }
            if (run.data !== `Object`) {
                options.options = {}
            }

            run = await this.getType({ initiator: me, stackTrace: result.stackTrace, data: options.availableValues })
            result.stackTrace = run.stackTrace
            if (run.error) {
                resolve(this.funcError({ me, result, run }))
                return
            }
            if (run.data !== `Object`) {
                options.availableValues = {}
            }

            for (const optionName in options.options) {
                let optionValue = options.options[optionName]
                run = await this.getType({ initiator: me, stackTrace: result.stackTrace, data: options.options[optionName] })
                result.stackTrace = run.stackTrace
                if (run.error) {
                    resolve(this.funcError({ me, result, run }))
                    return
                }
                let optionValueType = run.data

                let availableValuesValue = options.availableValues[optionName]
                run = await this.getType({ initiator: me, stackTrace: result.stackTrace, data: availableValuesValue })
                result.stackTrace = run.stackTrace
                if (run.error) {
                    resolve(this.funcError({ me, result, run }))
                    return
                }
                let availableValuesValueType = run.data

                if (optionValueType === `Object` && !(optionValue instanceof Readable) && !(optionValue instanceof Writable)) {
                    run = await this.isAvailableValues({ initiator: me, stackTrace: result.stackTrace, options: optionValue, availableValues: availableValuesValue })
                    result.stackTrace = run.stackTrace
                    if (run.error) {
                        resolve(this.funcError({ me, result, run }))
                        return
                    }
                    if (!run.data) {
                        resolve(this.funcSuccess({ me, result, data: false }, true ))
                        return
                    }
                    continue
                }

                if (availableValuesValueType !== `Object`) {
                    availableValuesValue = {}
                }

                for (const availableValuesValueName in availableValuesValue) {
                    let availableValuesValueValue = availableValuesValue[availableValuesValueName]

                    run = await this.getType({ initiator: me, stackTrace: result.stackTrace, data: availableValuesValueValue })
                    result.stackTrace = run.stackTrace
                    if (run.error) {
                        resolve(this.funcError({ me, result, run }))
                        return
                    }
                    let availableValuesValueValueType = run.data

                    switch (availableValuesValueName) {
                        case `min`:
                        case `max`:
                            if (optionValueType !== `Number`) {
                                resolve(this.funcError({ me, result, code: 1, message: `'opt.options.${optionName}' must be type of 'Number', because 'opt.availableValues.${optionName}' contain '${availableValuesValueName}' option. '${optionValueType}' given.` }))
                                return
                            }
                            if (availableValuesValueValueType !== `Number`) {
                                resolve(this.funcError({ me, result, code: 2, message: `'opt.availableValues.${optionName}.${availableValuesValueName}' must be type of 'Number'. '${availableValuesValueValueType}' given.` }))
                                return
                            }
                            switch (availableValuesValueName) {
                                case `min`:
                                    if (optionValue < availableValuesValueValue) {
                                        resolve(this.funcSuccess({ me, result, data: false }, true ))
                                        return
                                    }
                                    break
                                case `max`:
                                    if (optionValue > availableValuesValueValue) {
                                        resolve(this.funcSuccess({ me, result, data: false }, true ))
                                        return
                                    }
                                    break
                            }
                            break
                        case `minLength`:
                        case `maxLength`:
                            if (optionValueType !== `Number` && optionValueType !== `String` && optionValueType !== `Array`) {
                                resolve(this.funcError({ me, result, code: 3, message: `'opt.options.${optionName}' must be type of 'Number' or 'String' or 'Array', because 'opt.availableValues.${optionName}' contain '${availableValuesValueName}' option. '${optionValueType}' given.` }))
                                return
                            }
                            if (availableValuesValueValueType !== `Number`) {
                                resolve(this.funcError({ me, result, code: 4, message: `'opt.availableValues.${optionName}.${availableValuesValueName}' must be type of 'Number'. '${availableValuesValueValueType}' given.` }))
                                return
                            }
                            switch (availableValuesValueName) {
                                case `minLength`:
                                    if (optionValueType === `Number`) {
                                        if (optionValue.toString().length < availableValuesValueValue) {
                                            resolve(this.funcSuccess({ me, result, data: false }, true ))
                                            return
                                        }
                                    } else {
                                        if (optionValue.length < availableValuesValueValue) {
                                            resolve(this.funcSuccess({ me, result, data: false }, true ))
                                            return
                                        }
                                    }
                                    break
                                case `maxLength`:
                                    if (optionValueType === `Number`) {
                                        if (optionValue.toString().length > availableValuesValueValue) {
                                            resolve(this.funcSuccess({ me, result, data: false }, true ))
                                            return
                                        }
                                    } else {
                                        if (optionValue.length > availableValuesValueValue) {
                                            resolve(this.funcSuccess({ me, result, data: false }, true ))
                                            return
                                        }
                                    }
                                    break
                            }
                            break
                        case `values`:
                            if (availableValuesValueValueType !== `Array`) {
                                resolve(this.funcError({ me, result, code: 5, message: `'opt.availableValues.${optionName}.${availableValuesValueName}' must be type of 'Array'. '${availableValuesValueValueType}' given.` }))
                                return
                            }
                            if (availableValuesValueValue.length) {
                                if (!availableValuesValueValue.includes(optionValue)) {
                                    resolve(this.funcSuccess({ me, result, data: false }, true ))
                                    return
                                }
                            }
                            break
                        case `existPath`:
                            if (optionValueType !== `String`) {
                                resolve(this.funcError({ me, result, code: 6, message: `'options.${optionName}' must be type of 'String', because 'opt.availableValues.${optionName}' contain '${availableValuesValueName}' option. '${optionValueType}' given.` }))
                                return
                            }
                            if (availableValuesValueValueType !== `Boolean`) {
                                resolve(this.funcError({ me, result, code: 7, message: `'opt.availableValues.${optionName}.${availableValuesValueName}'must be type of 'Boolean'. '${availableValuesValueValueType}' given.` }))
                                return
                            }
                            if (!availableValuesValueValue) {
                                if (existsSync(optionValue)) {
                                    result.stackTrace.push(`${me}: Error: path '${optionValue}' must be not exists.`)
                                    resolve(this.funcSuccess({ me, result, data: false }, true ))
                                    return
                                }
                            } else {
                                if (!existsSync(optionValue)) {
                                    result.stackTrace.push(`${me}: Error: path '${optionValue}' must be exists.`)
                                    resolve(this.funcSuccess({ me, result, data: false }, true ))
                                    return
                                }
                            }
                            break
                        default:
                            resolve(this.funcError({ me, result, code: 8, message: `'options.availableValues.${optionName}' can contain 'min', 'max', 'minLength', 'maxLength', 'values', 'existPath' options. '${availableValuesValueName}' given.` }))
                            return
                    }
                }
            }

            resolve(this.funcSuccess({ me, result, data: true }, true ))
            return
        })
    }

    /**
     * @param {string} opt.initiator - Default: 'Unknown'
     * @param {array} opt.stackTrace - Default: []
     * @param {object} opt.options - Default: {}
     * @param {object} opt.defaultOptions - Default: {}
     * @param {object} opt.availableTypes - Default: {}
     * @param {object} opt.availableValues - Default: {}
     * @param {boolean} opt.hard - Default: false
     * 
     * @returns {promise}
     */
    static getOptions = (opt = {}) => {
        return new Promise(async (resolve) => {
            let [ me, result, options, run ] = await this.funcInit(`${this.me}->getOptions`, opt, true)

            run = await this.getType({ initiator: me, stackTrace: result.stackTrace, data: options.options })
            result.stackTrace = run.stackTrace
            if (run.error) {
                resolve(this.funcError({ me, result, run }))
                return
            }
            if (run.data !== `Object`) {
                options.options = {}
            }
            
            run = await this.getType({ initiator: me, stackTrace: result.stackTrace, data: options.defaultOptions })
            result.stackTrace = run.stackTrace
            if (run.error) {
                resolve(this.funcError({ me, result, run }))
                return
            }
            if (run.data !== `Object`) {
                options.defaultOptions = {}
            }

            run = await this.getType({ initiator: me, stackTrace: result.stackTrace, data: options.availableTypes })
            result.stackTrace = run.stackTrace
            if (run.error) {
                resolve(this.funcError({ me, result, run }))
                return
            }
            if (run.data !== `Object`) {
                options.availableTypes = {}
            }

            run = await this.getType({ initiator: me, stackTrace: result.stackTrace, data: options.availableValues })
            result.stackTrace = run.stackTrace
            if (run.error) {
                resolve(this.funcError({ me, result, run }))
                return
            }
            if (run.data !== `Object`) {
                options.availableValues = {}
            }

            run = await this.getType({ initiator: me, stackTrace: result.stackTrace, data: options.hard })
            result.stackTrace = run.stackTrace
            if (run.error) {
                resolve(this.funcError({ me, result, run }))
                return
            }
            if (run.data !== `Boolean`) {
                options.hard = false
            }

            run = await this.getDefaultOptions({ initiator: me, stackTrace: result.stackTrace, options: options.options, defaultOptions: options.defaultOptions, hard: options.hard })
            result.stackTrace = run.stackTrace
            if (run.error) {
                resolve(this.funcError({ me, result, run }))
                return
            }
            let newOptions = run.data

            run = await this.isAvailableTypes({ initiator: me, stackTrace: result.stackTrace, options: newOptions, availableTypes: options.availableTypes })
            result.stackTrace = run.stackTrace
            if (run.error) {
                resolve(this.funcError({ me, result, run }))
                return
            }
            if (!run.data) {
                resolve(this.funcError({ me, result, code: 1, message: `${me}: Not available types.` }))
                return
            }

            run = await this.isAvailableValues({ initiator: me, stackTrace: result.stackTrace, options: newOptions, availableValues: options.availableValues })
            result.stackTrace = run.stackTrace
            if (run.error) {
                resolve(this.funcError({ me, result, run }))
                return
            }
            if (!run.data) {
                resolve(this.funcError({ me, result, code: 2, message: `${me}: Not available values.` }))
                return
            }

            resolve(this.funcSuccess({ me, result, data: newOptions }, true ))
            return
        })
    }

    /**
     * @param {string} opt.initiator - Default: 'Unknown'
     * @param {array} opt.stackTrace - Default: []
     * @param {number} opt.min - Default: 0
     * @param {number} opt.max - Default: 1
     * 
     * @returns {promise}
     */
    static getRandInt = (opt = {}) => {
        return new Promise(async (resolve) => {
            let [ me, result, options, run ] = await this.funcInit(`${this.me}->getRandInt`, opt)

            let defaultOptions = {
                min: 0,
                max: 1
            }

            let availableTypes = {
                min: [ `Number` ],
                max: [ `Number` ]
            }

            let availableValues = {}

            run = await this.getOptions({ initiator: me, stackTrace: result.stackTrace, options, defaultOptions, availableTypes, availableValues })
            result.stackTrace = run.stackTrace
            if (run.error) {
                resolve(this.funcError({ me, result, run }))
                return
            }
            options = run.data

            resolve(this.funcSuccess({ me, result, data: Math.floor(Math.random() * (options.max - options.min + 1) + options.min) }))
            return
        })
    }
}