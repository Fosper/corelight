import { existsSync } from 'fs'
import { Readable, Writable } from 'stream'
import func from './lib/func'

export default class {
    static self = `corelight`
    static func = func

    /**
     * @param {object} @argument - Default: {}. 'func' instance.
     * @param {object} @argument - Default: {}. 'dumpLevel', 'dumpSplit', 'dumpFunc'.
     * @param {any} @argument - Required. 'data'.
     * 
     * @returns {object}
     */
    static getType = (...opt) => {
        let func = this.func.init(`${this.self}->getType`, opt)
            .args(`data`)
        return func.succ(Object.prototype.toString.call(func.opt.data).replace(`[object `, ``).replace(`]`, ``))
    }

    /**
     * @param {object} @argument - Default: {}. 'func' instance.
     * @param {object} @argument - Default: {}. 'dumpLevel', 'dumpSplit', 'dumpFunc'.
     * @param {object} @argument - Default: {}. 'options'. Must be first argument.
     * @param {object} @argument - Default: {}. 'defaultOptions'. Must be second argument.
     * @param {boolean} @argument - Default: {}. 'overwrite'. Must be third argument.
     * 
     * @returns {promise}
     */
    static getDefaultOptions = (...opt) => {
        return new Promise(async (resolve) => {
            let func = this.func.init(`${this.self}->getDefaultOptions`, opt)
                .args(`options`)
                .args(`defaultOptions`)
                .args(`overwrite`)
            let run

            if (this.getType(func, func.opt.options).data !== `Object`) func.opt.options = {}
            if (this.getType(func, func.opt.defaultOptions).data !== `Object`) func.opt.defaultOptions = {}
            if (this.getType(func, func.opt.overwrite).data !== `Boolean`) func.opt.overwrite = false
            
            let newOptions = func.opt.defaultOptions
            for (const optionName in func.opt.options) {
                let optionValue = func.opt.options[optionName]

            if (this.getType(func, func.opt.options).data !== `Object`) func.opt.options = {}
                let optionValueType = this.getType(func, optionValue).data
                let defaultOptionValue = func.opt.defaultOptions[optionName]
                let defaultOptionValueType = this.getType(func, defaultOptionValue).data

                if (optionValueType === `Object` && !(optionValue instanceof Readable) && !(optionValue instanceof Writable)) {
                    run = await this.getDefaultOptions(func, optionValue, defaultOptionValue, func.opt.overwrite )
                    if (run.error) {
                        resolve(func.error(run))
                        return
                    }
                    newOptions[optionName] = run.data
                    continue
                }

                if (func.opt.overwrite) {
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
            resolve(func.succ(newOptions))
            return
        })
    }

    /**
     * @param {object} @argument - Default: {}. 'func' instance.
     * @param {object} @argument - Default: {}. 'dumpLevel', 'dumpSplit', 'dumpFunc'.
     * @param {object} @argument - Default: {}. 'options'. Must be first argument.
     * @param {object} @argument - Default: {}. 'availableTypes'. Must be second argument.
     * @param {boolean} @argument - Default: {}. 'fullMatch'. Must be third argument.
     * 
     * @returns {promise}
     */
    static isAvailableTypes = (...opt) => {
        return new Promise(async (resolve) => {
            let func = this.func.init(`${this.self}->isAvailableTypes`, opt)
                .args(`options`)
                .args(`availableTypes`)
                .args(`fullMatch`)
            let run

            if (this.getType(func, func.opt.options).data !== `Object`) func.opt.options = {}
            if (this.getType(func, func.opt.availableTypes).data !== `Object`) func.opt.availableTypes = {}
            if (this.getType(func, func.opt.fullMatch).data !== `Boolean`) func.opt.fullMatch = false
    
            for (const optionName in func.opt.options) {
                let optionValue = func.opt.options[optionName]
                let optionValueType = this.getType(func, func.opt.options[optionName]).data
                let availableTypesValue = func.opt.availableTypes[optionName]
                let availableTypesValueType = this.getType(func, availableTypesValue).data
    
                if (optionValueType === `Object` && !(optionValue instanceof Readable) && !(optionValue instanceof Writable)) {
                    run = await this.isAvailableTypes(func, optionValue, availableTypesValue, func.opt.fullMatch)
                    if (run.error) {
                        resolve(func.error(run))
                        return
                    }
                    if (!run.data) {
                        resolve(func.succ(run))
                        return
                    }
                    continue
                }
                if (availableTypesValueType !== `Array`) {
                    if (func.opt.fullMatch) {
                        resolve(func.err(`'options.${optionName}' is set, and 'availableTypes.${optionName}' must be type of 'Array' (${availableTypesValueType} given), because 'fullMatch' is true.`, `1`, 2))
                        resolve(func.succ(false))
                        return
                    }
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
                resolve(func.err(`'options.${optionName}' must type of '${availableTypesValue.join(`', '`)}'. ${optionValueType} given.`, `2`, 2))
                return
            }
            resolve(func.succ(true))
            return
        })
    }

    /**
     * @param {object} @argument - Default: {}. 'func' instance.
     * @param {object} @argument - Default: {}. 'dumpLevel', 'dumpSplit', 'dumpFunc'.
     * @param {object} @argument - Default: {}. 'options'. Must be first argument.
     * @param {object} @argument - Default: {}. 'availableValues'. Must be second argument.
     * 
     * @returns {promise}
     */
    static isAvailableValues = (...opt) => {
        return new Promise(async (resolve) => {
            let func = this.func.init(`${this.self}->isAvailableValues`, opt)
                .args(`options`)
                .args(`availableValues`)
            let run

            if (this.getType(func, func.opt.options).data !== `Object`) func.opt.options = {}
            if (this.getType(func, func.opt.availableValues).data !== `Object`) func.opt.availableValues = {}

            for (const optionName in func.opt.options) {
                let optionValue = func.opt.options[optionName]
                let optionValueType = this.getType(func, func.opt.options[optionName]).data
                let availableValuesValue = func.opt.availableValues[optionName]
                let availableValuesValueType = this.getType(func, availableValuesValue).data

                if (optionValueType === `Object` && !(optionValue instanceof Readable) && !(optionValue instanceof Writable)) {
                    run = await this.isAvailableValues(func, optionValue, availableValuesValue)
                    if (run.error) {
                        resolve(func.error(run))
                        return
                    }
                    if (!run.data) {
                        resolve(func.succ(run))
                        return
                    }
                    continue
                }

                if (availableValuesValueType !== `Object`) {
                    availableValuesValue = {}
                }

                for (const availableValuesValueName in availableValuesValue) {
                    let availableValuesValueValue = availableValuesValue[availableValuesValueName]
                    let availableValuesValueValueType = this.getType(func, availableValuesValueValue).data

                    switch (availableValuesValueName) {
                        case `min`:
                        case `max`:
                            if (optionValueType !== `Number`) {
                                resolve(func.err(`'options.${optionName}' must be type of 'Number', because 'availableValues.${optionName}.${availableValuesValueName}' is set. '${optionValueType}' given.`, `1`, 1))
                                return
                            }
                            if (availableValuesValueValueType !== `Number`) {
                                resolve(func.err(`'availableValues.${optionName}.${availableValuesValueName}' must be type of 'Number'. '${availableValuesValueValueType}' given.`, `2`, 1))
                                return
                            }
                            switch (availableValuesValueName) {
                                case `min`:
                                    if (optionValue < availableValuesValueValue) {
                                        resolve(func.err(`'options.${optionName}' (${optionValue}) less than 'availableValues.${optionName}.${availableValuesValueName}' (${availableValuesValueValue}).`, `3`, 2))
                                        return
                                    }
                                    break
                                case `max`:
                                    if (optionValue > availableValuesValueValue) {
                                        resolve(func.err(`'options.${optionName}' (${optionValue}) more than 'availableValues.${optionName}.${availableValuesValueName}' (${availableValuesValueValue}).`, `4`, 2))
                                        return
                                    }
                                    break
                            }
                            break
                        case `minLength`:
                        case `maxLength`:
                            if (optionValueType !== `Number` && optionValueType !== `String` && optionValueType !== `Array`) {
                                resolve(func.err(`'options.${optionName}' must be type of 'Number' or 'String' or 'Array', because 'availableValues.${optionName}.${availableValuesValueName}' is set. '${optionValueType}' given.`, `5`, 1))
                                return
                            }
                            if (availableValuesValueValueType !== `Number`) {
                                resolve(func.err(`'availableValues.${optionName}.${availableValuesValueName}' must be type of 'Number'. '${availableValuesValueValueType}' given.`, `6`, 1))
                                return
                            }
                            switch (availableValuesValueName) {
                                case `minLength`:
                                    if (optionValueType === `Number`) {
                                        if (optionValue.toString().length < availableValuesValueValue) {
                                            resolve(func.err(`'options.${optionName}' length (${optionValue.length}) less than 'availableValues.${optionName}.${availableValuesValueName}' (${availableValuesValueValue}).`, `7`, 2))
                                            return
                                        }
                                    } else {
                                        if (optionValue.length < availableValuesValueValue) {
                                            resolve(func.err(`'options.${optionName}' length (${optionValue.length}) less than 'availableValues.${optionName}.${availableValuesValueName}' (${availableValuesValueValue}).`, `7`, 2))
                                            return
                                        }
                                    }
                                    break
                                case `maxLength`:
                                    if (optionValueType === `Number`) {
                                        if (optionValue.toString().length > availableValuesValueValue) {
                                            resolve(func.err(`'options.${optionName}' length (${optionValue.length}) more than 'availableValues.${optionName}.${availableValuesValueName}' (${availableValuesValueValue}).`, `8`, 2))
                                            return
                                        }
                                    } else {
                                        if (optionValue.length > availableValuesValueValue) {
                                            resolve(func.err(`'options.${optionName}' length (${optionValue.length}) more than 'availableValues.${optionName}.${availableValuesValueName}' (${availableValuesValueValue}).`, `8`, 2))
                                            return
                                        }
                                    }
                                    break
                            }
                            break
                        case `values`:
                            if (availableValuesValueValueType !== `Array`) {
                                resolve(func.err(`'availableValues.${optionName}.${availableValuesValueName}' must be type of 'Array'. '${availableValuesValueValueType}' given.`, `9`, 1))
                                return
                            }
                            if (availableValuesValueValue.length) {
                                if (!availableValuesValueValue.includes(optionValue)) {
                                    resolve(func.err(`'options.${optionName}' value must be one of '${availableValuesValueValue.join(`', '`)}'.`, `10`, 2))
                                    return
                                }
                            }
                            break
                        case `existPath`:
                            if (optionValueType !== `String`) {
                                resolve(func.err(`'options.${optionName}' must be type of 'String', because 'availableValues.${optionName}.${availableValuesValueName}' is set. '${optionValueType}' given.`, `11`, 1))
                                return
                            }
                            if (availableValuesValueValueType !== `Boolean`) {
                                resolve(func.err(`'availableValues.${optionName}.${availableValuesValueName}' must be type of 'Boolean'. '${availableValuesValueValueType}' given.`, `12`, 1))
                                return
                            }
                            if (!availableValuesValueValue) {
                                if (existsSync(optionValue)) {
                                    resolve(func.err(`'options.${optionName}' (${optionValue}) path must be not exists, because 'availableValues.${optionName}.${availableValuesValueName}' (${availableValuesValueValue.toString()}).`, `13`, 2))
                                    return
                                }
                            } else {
                                if (!existsSync(optionValue)) {
                                    resolve(func.err(`'options.${optionName}' (${optionValue}) path must be exists, because 'availableValues.${optionName}.${availableValuesValueName}' (${availableValuesValueValue.toString()}).`, `14`, 2))
                                    return
                                }
                            }
                            break
                        default:
                            resolve(func.err(`'options.availableValues.${optionName}' can contain 'min', 'max', 'minLength', 'maxLength', 'values', 'existPath' options. '${availableValuesValueName}' given.`, `15`, 1))
                            return
                    }
                }
            }
            resolve(func.succ(true))
            return
        })
    }

    /**
     * @param {object} @argument - Default: {}. 'func' instance.
     * @param {object} @argument - Default: {}. 'dumpLevel', 'dumpSplit', 'dumpFunc'.
     * @param {function} @argument - Default: () => {}. 'data'.
     * 
     * @returns {promise}
     */
    static try = (...opt) => {
        return new Promise(async (resolve) => {
            let func = this.func.init(`${this.self}->getRandInt`, opt)
                .args(`data`)

            func.default.data = () => {}
            func.types.data = [ `Function` ]
            await func.validate()
            if (func.result.error) {
                resolve(func.err())
                return
            }

            let result
            try {
                result = func.opt.data()
                resolve(func.succ(result))
            } catch (error) {
                resolve(func.err(error))
            }
            return
        })
    }

    /**
     * @param {object} @argument - Default: {}. 'func' instance.
     * @param {object} @argument - Default: {}. 'dumpLevel', 'dumpSplit', 'dumpFunc'.
     * @param {number} @argument - Default: 0. 'min'.
     * @param {number} @argument - Default: 1. 'max'.
     * 
     * @returns {promise}
     */
    static getRandInt = (...opt) => {
        return new Promise(async (resolve) => {
            let func = this.func.init(`${this.self}->getRandInt`, opt)
                .args(`min`)
                .args(`max`)

            func.default = {
                min: 0,
                max: 1
            }

            func.types = {
                min: [ `Number` ],
                max: [ `Number` ]
            }

            await func.validate()
            if (func.result.error) {
                resolve(func.err())
                return
            }
            resolve(func.succ(Math.floor(Math.random() * (func.opt.max - func.opt.min + 1) + func.opt.min)))
            return
        })
    }

}