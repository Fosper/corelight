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
     * @param {object} @argument - Default: {}. 'defaultMatch', 'defaultPrimary', 'defaultPure'. Must be third argument.
     * 
     * @returns {promise}
     */
    static getDefaultOptions = (...opt) => {
        return new Promise(async (resolve) => {
            let func = this.func.init(`${this.self}->getDefaultOptions`, opt)
                .args(`options`)
                .args(`defaultOptions`)
                .args()
            let run

            if (this.getType(func, func.opt.options).data !== `Object`) func.opt.options = {}
            if (this.getType(func, func.opt.defaultOptions).data !== `Object`) func.opt.defaultOptions = {}
            if (this.getType(func, func.opt.defaultMatch).data !== `Boolean`) func.opt.defaultMatch = false
            if (this.getType(func, func.opt.defaultPrimary).data !== `Boolean`) func.opt.defaultPrimary = false
            if (this.getType(func, func.opt.defaultPure).data !== `Boolean`) func.opt.defaultPure = false
            
            let newOptions = {}
            for (const optionName in func.opt.options) {
                let optionValue = func.opt.options[optionName]
                let optionValueType = this.getType(func, optionValue).data
                let defaultOptionValue = func.opt.defaultOptions[optionName]
                let defaultOptionValueType = this.getType(func, defaultOptionValue).data
                let defaultOptionExist = Object.keys(func.opt.defaultOptions).includes(optionName)

                if (func.opt.defaultMatch && !defaultOptionExist) {
                    resolve(func.err(`'options.${optionName}' not defined in 'default', but must be. Because option 'defaultMatch' is true.`, `1`, 2))
                    return
                }

                if (optionValueType === `Object` && !(optionValue instanceof Readable) && !(optionValue instanceof Writable)) {
                    run = await this.getDefaultOptions(func, optionValue, defaultOptionValue, { defaultMatch: func.opt.defaultMatch, defaultPrimary: func.opt.defaultPrimary, defaultPure: func.opt.defaultPure })
                    if (run.error) {
                        resolve(func.err(run))
                        return
                    }
                    newOptions[optionName] = run.data
                    continue
                }

                if (func.opt.defaultPrimary && defaultOptionExist) {
                    newOptions[optionName] = defaultOptionValue
                    continue
                }

                if (func.opt.defaultPure && !defaultOptionExist) {
                    continue
                }

                if (optionValueType === `Undefined` && defaultOptionExist) {
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
     * @param {object} @argument - Default: {}. 'typesMatch'. Must be third argument.
     * 
     * @returns {promise}
     */
    static isAvailableTypes = (...opt) => {
        return new Promise(async (resolve) => {
            let func = this.func.init(`${this.self}->isAvailableTypes`, opt)
                .args(`options`)
                .args(`availableTypes`)
                .args()
            let run

            if (this.getType(func, func.opt.options).data !== `Object`) func.opt.options = {}
            if (this.getType(func, func.opt.availableTypes).data !== `Object`) func.opt.availableTypes = {}
            if (this.getType(func, func.opt.typesMatch).data !== `Boolean`) func.opt.typesMatch = false
    
            for (const optionName in func.opt.options) {
                let optionValue = func.opt.options[optionName]
                let optionValueType = this.getType(func, func.opt.options[optionName]).data
                let availableTypesValue = func.opt.availableTypes[optionName]
                let availableTypesValueType = this.getType(func, availableTypesValue).data
                let availableTypesExist = Object.keys(func.opt.availableTypes).includes(optionName)
    
                if (func.opt.typesMatch && !availableTypesExist) {
                    resolve(func.err(`'options.${optionName}' must be defined in types options, because option 'typesMatch' is true.`, `1`, 2))
                    return
                }

                if (optionValueType === `Object` && !(optionValue instanceof Readable) && !(optionValue instanceof Writable)) {
                    run = await this.isAvailableTypes(func, optionValue, availableTypesValue, { typesMatch: func.opt.typesMatch })
                    if (run.error) {
                        resolve(func.err(run))
                        return
                    }
                    if (!run.data) {
                        resolve(func.succ(run))
                        return
                    }
                    continue
                }

                if (availableTypesValueType !== `Array` && availableTypesValueType !== `Undefined`) {
                    resolve(func.err(`'options.${optionName}' must be type of 'Array' or 'Undefined'. ${availableTypesValueType} given.`, `2`, 1))
                    return
                }

                if (availableTypesValueType === `Undefined`) {
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
     * @param {object} @argument - Default: {}. 'valuesMatch'. Must be second argument.
     * 
     * @returns {promise}
     */
    static isAvailableValues = (...opt) => {
        return new Promise(async (resolve) => {
            let func = this.func.init(`${this.self}->isAvailableValues`, opt)
                .args(`options`)
                .args(`availableValues`)
                .args()
            let run

            if (this.getType(func, func.opt.options).data !== `Object`) func.opt.options = {}
            if (this.getType(func, func.opt.availableValues).data !== `Object`) func.opt.availableValues = {}
            if (this.getType(func, func.opt.valuesMatch).data !== `Boolean`) func.opt.valuesMatch = false

            for (const optionName in func.opt.options) {
                let optionValue = func.opt.options[optionName]
                let optionValueType = this.getType(func, func.opt.options[optionName]).data
                let availableValuesValue = func.opt.availableValues[optionName]
                let availableValuesValueType = this.getType(func, availableValuesValue).data
                let availableValuesExist = Object.keys(func.opt.availableValues).includes(optionName)

                if (func.opt.valuesMatch && !availableValuesExist) {
                    resolve(func.err(`'options.${optionName}' must be defined in types options, because option 'valuesMatch' is true.`, `1`, 2))
                    return
                }

                if (optionValueType === `Object` && !(optionValue instanceof Readable) && !(optionValue instanceof Writable)) {
                    run = await this.isAvailableValues(func, optionValue, availableValuesValue, { valuesMatch: func.opt.valuesMatch })
                    if (run.error) {
                        resolve(func.err(run))
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
     * @param {object} @argument - Default: {}. 'options', 'default', 'types', 'values', 'defaultMatch', 'defaultPrimary', 'defaultPure', 'typesMatch', 'valuesMatch'
     * 
     * @returns {promise}
     */
    static validate = (...opt) => {
        return new Promise(async (resolve) => {
            let func = this.func.init(`${this.self}->validate`, opt).args()
            let run

            if (this.getType(func, func.opt.options).data !== `Object`) func.opt.options = {}
            if (this.getType(func, func.opt.default).data !== `Object`) func.opt.default = {}
            if (this.getType(func, func.opt.types).data !== `Object`) func.opt.types = {}
            if (this.getType(func, func.opt.values).data !== `Object`) func.opt.values = {}
            if (this.getType(func, func.opt.defaultMatch).data !== `Boolean`) func.opt.defaultMatch = false
            if (this.getType(func, func.opt.defaultPrimary).data !== `Boolean`) func.opt.defaultPrimary = false
            if (this.getType(func, func.opt.defaultPure).data !== `Boolean`) func.opt.defaultPure = false
            if (this.getType(func, func.opt.typesMatch).data !== `Boolean`) func.opt.typesMatch = false
            if (this.getType(func, func.opt.valuesMatch).data !== `Boolean`) func.opt.valuesMatch = false

            run = await this.getDefaultOptions(func, func.opt.options, func.opt.default, { defaultMatch: func.opt.defaultMatch, defaultPrimary: func.opt.defaultPrimary, defaultPure: func.opt.defaultPure })
            if (run.error) {
                resolve(func.err(run))
                return
            }
            func.opt.options = run.data
            run = await this.isAvailableTypes(func, func.opt.options, func.opt.types, { typesMatch: func.opt.typesMatch })
            if (run.error) {
                resolve(func.err(run))
                return
            }
            run = await this.isAvailableValues(func, func.opt.options, func.opt.values, { valuesMatch: func.opt.valuesMatch })
            if (run.error) {
                resolve(func.err(run))
                return
            }
            resolve(func.succ(func.opt.options))
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
            let func = this.func.init(`${this.self}->try`, opt)
                .args(`data`)
            let run

            func.default.data = () => {}
            func.types.data = [ `Function` ]
            await func.validate()
            if (func.result.error) {
                resolve(func.err())
                return
            }

            try {
                run = func.opt.data()
                resolve(func.succ(run))
            } catch (error) {
                resolve(func.err(`${error}`, `1`))
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