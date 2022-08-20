import { Readable, Writable } from 'stream'
import corelight from '../index'

export default class {
    constructor(name, opt, dump, dumpLevel, dumpFunc, argums) {
        this.isFunc = true
        this.name = name
        this.opt = opt
        this.result = {
            data: null,
            error: null,
            dump: dump
        },
        this.dumpLevel = dumpLevel
        this.dumpFunc = dumpFunc
        this.argums = argums
        this.default = {}
        this.types = {}
        this.values = {}
    }

    /**
     * @param {string} @argument - Default: 'Unknown'. 'name'. Must be first string argument.
     * @param {string} @argument - Default: 'Unknown'. 'initiator'. Must be last string argument.
     * @param {object} @argument - Default: {}. 'func' instance.
     * @param {object} @argument - Default: {}. 'options'.
     * @param {array} @argument - Default: []. 'func' instance or 'options' or 'argums'.
     * @param {number} @argument - Default: 0. 'dumpLevel'.
     * @param {boolean} @argument - Default: false. For: 'dumpSplit'.
     * @param {function} @argument - Default: null. 'dumpFunc'.
     * @param {null} @argument - Default: null. 'dumpFunc'.
     * 
     * @returns {object} this
     */
    static init = (...opt) => {
        let name = `Unknown`
        let initiator = `Unknown`
        let dumpLevel = 1 // 0: Nothing, 1: Errors only, 2: Errors & Warnings, 3: Errors & Warnings & Notifications.
        let dumpSplit = false
        let dumpFunc = null

        let func = {}
        for (let optValue of opt) {
            if (Object.prototype.toString.call(optValue) === `[object Array]`) {
                for (let optValue2 of optValue) {
                    if (Object.prototype.toString.call(optValue2) === `[object Object]`) {
                        if (Object.prototype.toString.call(optValue2.isFunc) === `[object Boolean]` && optValue2.isFunc) {
                            func = optValue2
                            break
                        }
                    }
                }
            } else if (Object.prototype.toString.call(optValue) === `[object Object]`) {
                for (const optName in optValue) {
                    if (Object.prototype.toString.call(optValue[optName]) === `[object Object]`) {
                        if (Object.prototype.toString.call(optValue[optName].isFunc) === `[object Boolean]` && optValue[optName].isFunc) {
                            func = optValue[optName]
                            break
                        }
                    }
                }
            }
        }

        let dump = []
        if (Object.prototype.toString.call(func.name) === `[object String]`) initiator = func.name
        if (Object.prototype.toString.call(func.dumpLevel) === `[object Number]`) dumpLevel = func.dumpLevel
        if (Object.prototype.toString.call(func.dumpFunc) === `[object Function]`) dumpFunc = func.dumpFunc
        if (Object.prototype.toString.call(func.result?.dump) === `[object Array]`) dump = func.result.dump

        let stringCount = 0
        for (let optValue of opt) {
            if (Object.prototype.toString.call(optValue) === `[object String]`) {
                stringCount++
                if (stringCount === 1) name = optValue
                if (stringCount === 2) initiator = optValue
            } else if (Object.prototype.toString.call(optValue) === `[object Number]`) {
                dumpLevel = optValue
            } else if (Object.prototype.toString.call(optValue) === `[object Boolean]`) {
                dumpSplit = optValue
            } else if (Object.prototype.toString.call(optValue) === `[object Function]`) {
                dumpFunc = optValue
            }
        }

        let argums = []
        let options = {}
        for (let optValue of opt) {
            if (Object.prototype.toString.call(optValue) === `[object Array]`) {
                for (let optValue2 of optValue) {
                    if (Object.prototype.toString.call(optValue2) === `[object Object]`) {
                        if (optValue2.isFunc) continue
                        if (Object.prototype.toString.call(optValue2.initiator) === `[object String]` || Object.prototype.toString.call(optValue2.dumpLevel) === `[object Number]` || Object.prototype.toString.call(optValue2.dumpSplit) === `[object Boolean]` || Object.prototype.toString.call(optValue2.dumpFunc) === `[object Function]`) {
                            if (Object.prototype.toString.call(optValue2.initiator) === `[object String]`) {
                                initiator = optValue2.initiator
                            }
                            if (Object.prototype.toString.call(optValue2.dumpLevel) === `[object Number]`) {
                                dumpLevel = optValue2.dumpLevel
                            }
                            if (Object.prototype.toString.call(optValue2.dumpSplit) === `[object Boolean]`) {
                                dumpSplit = optValue2.dumpSplit
                            }
                            if (Object.prototype.toString.call(optValue2.dumpFunc) === `[object Function]`) {
                                dumpFunc = optValue2.dumpFunc
                            }
                            continue
                        }
                        argums.push(optValue2)
                    } else {
                        argums.push(optValue2)
                    }
                }
            } else if (Object.prototype.toString.call(optValue) === `[object Object]`) {
                if (optValue.isFunc) continue
                if (Object.prototype.toString.call(optValue.initiator) === `[object String]` || Object.prototype.toString.call(optValue.dumpLevel) === `[object Number]` || Object.prototype.toString.call(optValue.dumpSplit) === `[object Boolean]` || Object.prototype.toString.call(optValue.dumpFunc) === `[object Function]`) {
                    if (Object.prototype.toString.call(optValue.initiator) === `[object String]`) {
                        initiator = optValue.initiator
                    }
                    if (Object.prototype.toString.call(optValue.dumpLevel) === `[object Number]`) {
                        dumpLevel = optValue.dumpLevel
                    }
                    if (Object.prototype.toString.call(optValue.dumpSplit) === `[object Boolean]`) {
                        dumpSplit = optValue.dumpSplit
                    }
                    if (Object.prototype.toString.call(optValue.dumpFunc) === `[object Function]`) {
                        dumpFunc = optValue.dumpFunc
                    }
                    continue
                }
                argums.push(optValue)
            }
        }

        if (dumpSplit) dump = [ ...dump ]
        if (name !== `Unknown` && name !== initiator) name = `${initiator}->${name}`

        let _func = new this(name, options, dump, dumpLevel, dumpFunc, argums)
        _func.dump(`Started.`, 3)
        return _func
    }

    /**
     * @param {any} @argument - Required. 'data'. Must be first argument.
     * @param {number} @argument - Default: 3. 'dumpLevel'.
     * @param {function} @argument - Default: this.dumpFunc. 'dumpFunc'.
     * @param {null} @argument - Default: this.dumpFunc. 'dumpFunc'.
     * 
     * @returns {object} this
     */
    dump = (...opt) => {
        let data = ``
        let dumpLevel = 3
        let dumpFunc = this.dumpFunc
        let msg = ``
        let type = `Notify`

        for (let optValue of opt) {
            if (Object.prototype.toString.call(optValue) === `[object Number]`) dumpLevel = optValue
            if (Object.prototype.toString.call(optValue) === `[object Function]` || Object.prototype.toString.call(optValue) === `[object Null]`) dumpFunc = optValue
        }

        if (dumpLevel === 2) type = `Warning`
        if (dumpLevel === 1) type = `Error`

        if (!opt.length) {
            if (this.dumpLevel > 0) {
                msg = `${this.name} (${type}): Function 'dump' error. Arguments is empty.`
                this.result.dump.push(msg)
                if (dumpFunc) dumpFunc(msg)
            }
            return this
        }

        if (dumpLevel <= this.dumpLevel) {
            data = opt.shift()

            let dataType = Object.prototype.toString.call(data).replace(`[object `, ``).replace(`]`, ``)
            let typesToString = [ `Undefined`, `Boolean`, `Number`, `String`, `Null` ]
            if (!typesToString.includes(dataType)) {
                msg = `${this.name} (${type}): Function 'dump' error. Data type: '${dataType}' instead '${typesToString.join(`' ,'`)}'.`
            } else {
                msg = `${this.name} (${type}): ${data.toString()}`
            }
    
            this.result.dump.push(msg)
            if (dumpFunc) dumpFunc(msg)
        }

        return this
    }

    /**
     * @param {any} @argument - Default: null. 'data'. Must be first argument.
     * @param {number} @argument - Default: 3. 'dumpLevel'.
     * @param {function} @argument - Default: this.dumpFunc. 'dumpFunc'.
     * @param {null} @argument - Default: this.dumpFunc. 'dumpFunc'.
     * 
     * @returns {object} this
     */
    succ = (...opt) => {
        let data = this.result.data
        let dumpLevel = 3
        let dumpFunc = this.dumpFunc

        let i = 0
        for (let optValue of opt) {
            i++
            if (i === 1) {
                if (Object.prototype.toString.call(optValue) === `[object Object]` && Object.prototype.toString.call(optValue.data) !== `[object Undefined]` && Object.prototype.toString.call(optValue.error) !== `[object Undefined]`) {
                    data = optValue.data
                } else {
                    data = optValue
                }
            } else if (Object.prototype.toString.call(optValue) === `[object Number]`) {
                dumpLevel = optValue
            } else if (Object.prototype.toString.call(optValue) === `[object Function]` || Object.prototype.toString.call(optValue) === `[object Null]`) {
                dumpFunc = optValue
            }
        }

        this.result.data = data

        if (dumpLevel <= this.dumpLevel) {
            let msg = ``
            let dataType = Object.prototype.toString.call(this.result.data).replace(`[object `, ``).replace(`]`, ``)
            let typesToString = [ `Undefined`, `Boolean`, `Number`, `String`, `Null` ]
            if (typesToString.includes(dataType)) {
                msg = `Data type: ${dataType}. Data: ${this.result.data.toString()}.`
            } else if (this.result.data instanceof Readable) {
                msg = `Data type: Readable. Path: ${this.result.data.path}.`
            } else if (this.result.data instanceof Writable) {
                msg = `Data type: Writable. Path: ${this.result.data.path}.`
            } else if (dataType === `Object`) {
                msg = `Data type: ${dataType}. Data: ${JSON.stringify(this.result.data)}.`
            } else {
                msg = `Data type: ${dataType}.`
            }
            this.dump(msg, dumpLevel, dumpFunc)
            this.dump(`Success.`, dumpLevel, dumpFunc)
        }

        return this.result
    }

    /**
     * @param {string} @argument - Default: ''. 'message'. Must be first string argument.
     * @param {string} @argument - Default: '0'. 'code'. Must be second string argument.
     * @param {number} @argument - Default: 3. 'dumpLevel'.
     * @param {function} @argument - Default: this.dumpFunc. 'dumpFunc'.
     * @param {null} @argument - Default: this.dumpFunc. 'dumpFunc'.
     * 
     * @returns {object} this
     */
    err = (...opt) => {
        let message = ``
        let code = `0`
        let dumpLevel = 3
        let dumpFunc = this.dumpFunc

        if (this.result.error) {
            if (Object.prototype.toString.call(this.result.error.message) === `[object String]`) {
                message = this.result.error.message
            }
            if (Object.prototype.toString.call(this.result.error.code) === `[object String]`) {
                code = this.result.error.code
            }
        }

        let stringCount = 0
        for (let optValue of opt) {
            if (Object.prototype.toString.call(optValue) === `[object String]`) {
                stringCount++
                if (stringCount === 1) message = optValue
                if (stringCount === 2) code = optValue
            } else if (Object.prototype.toString.call(optValue) === `[object Number]`) {
                dumpLevel = optValue
            } else if (Object.prototype.toString.call(optValue) === `[object Function]` || Object.prototype.toString.call(optValue) === `[object Null]`) {
                dumpFunc = optValue
            } else if (Object.prototype.toString.call(optValue) === `[object Object]` && Object.prototype.toString.call(optValue.data) !== `[object Undefined]` && Object.prototype.toString.call(optValue.error) === `[object Object]`) {
                if (Object.prototype.toString.call(optValue.error.message) === `[object String]`) {
                    message = optValue.error.message
                }
                if (Object.prototype.toString.call(optValue.error.code) === `[object String]`) {
                    code = optValue.error.code
                }
            }
        }

        this.result.error = { code, message }

        if (dumpLevel <= this.dumpLevel) {
            this.dump(`Error code: ${this.result.error.code}. Error message: ${this.result.error.message}`, dumpLevel, dumpFunc)
        }

        return this.result
    }

    /**
     * @param {string} @argument - Default: ''. 'optValue'.
     * 
     * @returns {object} this
     */
    args = (...opt) => {
        if (!opt.length) {
            let argumsLength = this.argums.length
            let i = 0
            for (let argumValue of this.argums) {
                if (Object.prototype.toString.call(argumValue) === `[object Object]` && argumsLength === 1) {
                    for (const argumValueName in argumValue) {
                        this.opt[argumValueName] = argumValue[argumValueName]
                    }
                    this.argums.shift()
                } else {
                    i++
                    this.opt[`arg${i}`] = this.argums.shift()
                }
            }
        } else {
            for (let optValue of opt) {
                if (Object.prototype.toString.call(optValue) === `[object String]`) {
                    if (this.argums.length) {
                        this.opt[optValue] = this.argums.shift()
                    } else {
                        this.opt[optValue] = undefined
                    }
                }
            }
        }

        return this
    }

    /**
     * @param {object} @argument - Default: {}. 'overwrite', 'fullMatch'
     * @param {number} @argument - Default: this.dumpLevel. 'dumpLevel'.
     * @param {function} @argument - Default: this.dumpFunc. 'dumpFunc'.
     * @param {null} @argument - Default: this.dumpFunc. 'dumpFunc'.
     * 
     * @returns {promise} this
     */
    validate = (...opt) => {
        return new Promise(async (resolve) => {
            let overwrite = false
            let fullMatch = false
            let dumpLevel = this.dumpLevel
            let dumpFunc = this.dumpFunc

            let run

            for (let optValue of opt) {
                if (Object.prototype.toString.call(optValue) === `[object Object]`) {
                    if (Object.prototype.toString.call(optValue.overwrite) === `[object Boolean]`) {
                        overwrite = optValue.overwrite
                    }
                    if (Object.prototype.toString.call(optValue.fullMatch) === `[object Boolean]`) {
                        fullMatch = optValue.fullMatch
                    }
                } else if (Object.prototype.toString.call(optValue) === `[object Number]`) {
                    dumpLevel = optValue
                } else if (Object.prototype.toString.call(optValue.dumpFunc) === `[object Function]` || Object.prototype.toString.call(optValue.dumpFunc) === `[object Null]`) {
                    dumpFunc = optValue.dumpFunc
                }
            }

            if (Object.prototype.toString.call(this.default) !== `[object Object]`) {
                resolve(this.err(`'func.default' must be type of 'Object'. '${Object.prototype.toString.call(this.default)}' given.`, `1`, 1))
                return
            }
            if (Object.prototype.toString.call(this.types) !== `[object Object]`) {
                resolve(this.err(`'func.types' must be type of 'Object'. '${Object.prototype.toString.call(this.types)}' given.`, `2`, 1))
                return
            }
            if (Object.prototype.toString.call(this.values) !== `[object Object]`) {
                resolve(this.err(`'func.values' must be type of 'Object'. '${Object.prototype.toString.call(this.values)}' given.`, `3`, 1))
                return
            }

            run = await corelight.validate(this, this.opt, this.default, this.types, this.values, overwrite, fullMatch, { dumpLevel, dumpFunc })
            if (run.error) {
                resolve(this.err(run))
                return
            }
            this.opt = run.data
            resolve(this)
            return
        })
    }
}