// modules are defined as an array
// [ module function, map of requires ]
//
// map of requires is short require name -> numeric require
//
// anything defined in a previous bundle is accessed via the
// orig method which is the require for previous bundles
parcelRequire = (function (modules, cache, entry, globalName) {
  // Save the require from previous bundle to this closure if any
  var previousRequire = typeof parcelRequire === 'function' && parcelRequire;
  var nodeRequire = typeof require === 'function' && require;

  function newRequire(name, jumped) {
    if (!cache[name]) {
      if (!modules[name]) {
        // if we cannot find the module within our internal map or
        // cache jump to the current global require ie. the last bundle
        // that was added to the page.
        var currentRequire = typeof parcelRequire === 'function' && parcelRequire;
        if (!jumped && currentRequire) {
          return currentRequire(name, true);
        }

        // If there are other bundles on this page the require from the
        // previous one is saved to 'previousRequire'. Repeat this as
        // many times as there are bundles until the module is found or
        // we exhaust the require chain.
        if (previousRequire) {
          return previousRequire(name, true);
        }

        // Try the node require function if it exists.
        if (nodeRequire && typeof name === 'string') {
          return nodeRequire(name);
        }

        var err = new Error('Cannot find module \'' + name + '\'');
        err.code = 'MODULE_NOT_FOUND';
        throw err;
      }

      localRequire.resolve = resolve;
      localRequire.cache = {};

      var module = cache[name] = new newRequire.Module(name);

      modules[name][0].call(module.exports, localRequire, module, module.exports, this);
    }

    return cache[name].exports;

    function localRequire(x){
      return newRequire(localRequire.resolve(x));
    }

    function resolve(x){
      return modules[name][1][x] || x;
    }
  }

  function Module(moduleName) {
    this.id = moduleName;
    this.bundle = newRequire;
    this.exports = {};
  }

  newRequire.isParcelRequire = true;
  newRequire.Module = Module;
  newRequire.modules = modules;
  newRequire.cache = cache;
  newRequire.parent = previousRequire;
  newRequire.register = function (id, exports) {
    modules[id] = [function (require, module) {
      module.exports = exports;
    }, {}];
  };

  var error;
  for (var i = 0; i < entry.length; i++) {
    try {
      newRequire(entry[i]);
    } catch (e) {
      // Save first error but execute all entries
      if (!error) {
        error = e;
      }
    }
  }

  if (entry.length) {
    // Expose entry point to Node, AMD or browser globals
    // Based on https://github.com/ForbesLindesay/umd/blob/master/template.js
    var mainExports = newRequire(entry[entry.length - 1]);

    // CommonJS
    if (typeof exports === "object" && typeof module !== "undefined") {
      module.exports = mainExports;

    // RequireJS
    } else if (typeof define === "function" && define.amd) {
     define(function () {
       return mainExports;
     });

    // <script>
    } else if (globalName) {
      this[globalName] = mainExports;
    }
  }

  // Override the current require with this new one
  parcelRequire = newRequire;

  if (error) {
    // throw error from earlier, _after updating parcelRequire_
    throw error;
  }

  return newRequire;
})({"node_modules/regenerator-runtime/runtime.js":[function(require,module,exports) {
var define;
/**
 * Copyright (c) 2014-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

var runtime = (function (exports) {
  "use strict";

  var Op = Object.prototype;
  var hasOwn = Op.hasOwnProperty;
  var undefined; // More compressible than void 0.
  var $Symbol = typeof Symbol === "function" ? Symbol : {};
  var iteratorSymbol = $Symbol.iterator || "@@iterator";
  var asyncIteratorSymbol = $Symbol.asyncIterator || "@@asyncIterator";
  var toStringTagSymbol = $Symbol.toStringTag || "@@toStringTag";

  function define(obj, key, value) {
    Object.defineProperty(obj, key, {
      value: value,
      enumerable: true,
      configurable: true,
      writable: true
    });
    return obj[key];
  }
  try {
    // IE 8 has a broken Object.defineProperty that only works on DOM objects.
    define({}, "");
  } catch (err) {
    define = function(obj, key, value) {
      return obj[key] = value;
    };
  }

  function wrap(innerFn, outerFn, self, tryLocsList) {
    // If outerFn provided and outerFn.prototype is a Generator, then outerFn.prototype instanceof Generator.
    var protoGenerator = outerFn && outerFn.prototype instanceof Generator ? outerFn : Generator;
    var generator = Object.create(protoGenerator.prototype);
    var context = new Context(tryLocsList || []);

    // The ._invoke method unifies the implementations of the .next,
    // .throw, and .return methods.
    generator._invoke = makeInvokeMethod(innerFn, self, context);

    return generator;
  }
  exports.wrap = wrap;

  // Try/catch helper to minimize deoptimizations. Returns a completion
  // record like context.tryEntries[i].completion. This interface could
  // have been (and was previously) designed to take a closure to be
  // invoked without arguments, but in all the cases we care about we
  // already have an existing method we want to call, so there's no need
  // to create a new function object. We can even get away with assuming
  // the method takes exactly one argument, since that happens to be true
  // in every case, so we don't have to touch the arguments object. The
  // only additional allocation required is the completion record, which
  // has a stable shape and so hopefully should be cheap to allocate.
  function tryCatch(fn, obj, arg) {
    try {
      return { type: "normal", arg: fn.call(obj, arg) };
    } catch (err) {
      return { type: "throw", arg: err };
    }
  }

  var GenStateSuspendedStart = "suspendedStart";
  var GenStateSuspendedYield = "suspendedYield";
  var GenStateExecuting = "executing";
  var GenStateCompleted = "completed";

  // Returning this object from the innerFn has the same effect as
  // breaking out of the dispatch switch statement.
  var ContinueSentinel = {};

  // Dummy constructor functions that we use as the .constructor and
  // .constructor.prototype properties for functions that return Generator
  // objects. For full spec compliance, you may wish to configure your
  // minifier not to mangle the names of these two functions.
  function Generator() {}
  function GeneratorFunction() {}
  function GeneratorFunctionPrototype() {}

  // This is a polyfill for %IteratorPrototype% for environments that
  // don't natively support it.
  var IteratorPrototype = {};
  define(IteratorPrototype, iteratorSymbol, function () {
    return this;
  });

  var getProto = Object.getPrototypeOf;
  var NativeIteratorPrototype = getProto && getProto(getProto(values([])));
  if (NativeIteratorPrototype &&
      NativeIteratorPrototype !== Op &&
      hasOwn.call(NativeIteratorPrototype, iteratorSymbol)) {
    // This environment has a native %IteratorPrototype%; use it instead
    // of the polyfill.
    IteratorPrototype = NativeIteratorPrototype;
  }

  var Gp = GeneratorFunctionPrototype.prototype =
    Generator.prototype = Object.create(IteratorPrototype);
  GeneratorFunction.prototype = GeneratorFunctionPrototype;
  define(Gp, "constructor", GeneratorFunctionPrototype);
  define(GeneratorFunctionPrototype, "constructor", GeneratorFunction);
  GeneratorFunction.displayName = define(
    GeneratorFunctionPrototype,
    toStringTagSymbol,
    "GeneratorFunction"
  );

  // Helper for defining the .next, .throw, and .return methods of the
  // Iterator interface in terms of a single ._invoke method.
  function defineIteratorMethods(prototype) {
    ["next", "throw", "return"].forEach(function(method) {
      define(prototype, method, function(arg) {
        return this._invoke(method, arg);
      });
    });
  }

  exports.isGeneratorFunction = function(genFun) {
    var ctor = typeof genFun === "function" && genFun.constructor;
    return ctor
      ? ctor === GeneratorFunction ||
        // For the native GeneratorFunction constructor, the best we can
        // do is to check its .name property.
        (ctor.displayName || ctor.name) === "GeneratorFunction"
      : false;
  };

  exports.mark = function(genFun) {
    if (Object.setPrototypeOf) {
      Object.setPrototypeOf(genFun, GeneratorFunctionPrototype);
    } else {
      genFun.__proto__ = GeneratorFunctionPrototype;
      define(genFun, toStringTagSymbol, "GeneratorFunction");
    }
    genFun.prototype = Object.create(Gp);
    return genFun;
  };

  // Within the body of any async function, `await x` is transformed to
  // `yield regeneratorRuntime.awrap(x)`, so that the runtime can test
  // `hasOwn.call(value, "__await")` to determine if the yielded value is
  // meant to be awaited.
  exports.awrap = function(arg) {
    return { __await: arg };
  };

  function AsyncIterator(generator, PromiseImpl) {
    function invoke(method, arg, resolve, reject) {
      var record = tryCatch(generator[method], generator, arg);
      if (record.type === "throw") {
        reject(record.arg);
      } else {
        var result = record.arg;
        var value = result.value;
        if (value &&
            typeof value === "object" &&
            hasOwn.call(value, "__await")) {
          return PromiseImpl.resolve(value.__await).then(function(value) {
            invoke("next", value, resolve, reject);
          }, function(err) {
            invoke("throw", err, resolve, reject);
          });
        }

        return PromiseImpl.resolve(value).then(function(unwrapped) {
          // When a yielded Promise is resolved, its final value becomes
          // the .value of the Promise<{value,done}> result for the
          // current iteration.
          result.value = unwrapped;
          resolve(result);
        }, function(error) {
          // If a rejected Promise was yielded, throw the rejection back
          // into the async generator function so it can be handled there.
          return invoke("throw", error, resolve, reject);
        });
      }
    }

    var previousPromise;

    function enqueue(method, arg) {
      function callInvokeWithMethodAndArg() {
        return new PromiseImpl(function(resolve, reject) {
          invoke(method, arg, resolve, reject);
        });
      }

      return previousPromise =
        // If enqueue has been called before, then we want to wait until
        // all previous Promises have been resolved before calling invoke,
        // so that results are always delivered in the correct order. If
        // enqueue has not been called before, then it is important to
        // call invoke immediately, without waiting on a callback to fire,
        // so that the async generator function has the opportunity to do
        // any necessary setup in a predictable way. This predictability
        // is why the Promise constructor synchronously invokes its
        // executor callback, and why async functions synchronously
        // execute code before the first await. Since we implement simple
        // async functions in terms of async generators, it is especially
        // important to get this right, even though it requires care.
        previousPromise ? previousPromise.then(
          callInvokeWithMethodAndArg,
          // Avoid propagating failures to Promises returned by later
          // invocations of the iterator.
          callInvokeWithMethodAndArg
        ) : callInvokeWithMethodAndArg();
    }

    // Define the unified helper method that is used to implement .next,
    // .throw, and .return (see defineIteratorMethods).
    this._invoke = enqueue;
  }

  defineIteratorMethods(AsyncIterator.prototype);
  define(AsyncIterator.prototype, asyncIteratorSymbol, function () {
    return this;
  });
  exports.AsyncIterator = AsyncIterator;

  // Note that simple async functions are implemented on top of
  // AsyncIterator objects; they just return a Promise for the value of
  // the final result produced by the iterator.
  exports.async = function(innerFn, outerFn, self, tryLocsList, PromiseImpl) {
    if (PromiseImpl === void 0) PromiseImpl = Promise;

    var iter = new AsyncIterator(
      wrap(innerFn, outerFn, self, tryLocsList),
      PromiseImpl
    );

    return exports.isGeneratorFunction(outerFn)
      ? iter // If outerFn is a generator, return the full iterator.
      : iter.next().then(function(result) {
          return result.done ? result.value : iter.next();
        });
  };

  function makeInvokeMethod(innerFn, self, context) {
    var state = GenStateSuspendedStart;

    return function invoke(method, arg) {
      if (state === GenStateExecuting) {
        throw new Error("Generator is already running");
      }

      if (state === GenStateCompleted) {
        if (method === "throw") {
          throw arg;
        }

        // Be forgiving, per 25.3.3.3.3 of the spec:
        // https://people.mozilla.org/~jorendorff/es6-draft.html#sec-generatorresume
        return doneResult();
      }

      context.method = method;
      context.arg = arg;

      while (true) {
        var delegate = context.delegate;
        if (delegate) {
          var delegateResult = maybeInvokeDelegate(delegate, context);
          if (delegateResult) {
            if (delegateResult === ContinueSentinel) continue;
            return delegateResult;
          }
        }

        if (context.method === "next") {
          // Setting context._sent for legacy support of Babel's
          // function.sent implementation.
          context.sent = context._sent = context.arg;

        } else if (context.method === "throw") {
          if (state === GenStateSuspendedStart) {
            state = GenStateCompleted;
            throw context.arg;
          }

          context.dispatchException(context.arg);

        } else if (context.method === "return") {
          context.abrupt("return", context.arg);
        }

        state = GenStateExecuting;

        var record = tryCatch(innerFn, self, context);
        if (record.type === "normal") {
          // If an exception is thrown from innerFn, we leave state ===
          // GenStateExecuting and loop back for another invocation.
          state = context.done
            ? GenStateCompleted
            : GenStateSuspendedYield;

          if (record.arg === ContinueSentinel) {
            continue;
          }

          return {
            value: record.arg,
            done: context.done
          };

        } else if (record.type === "throw") {
          state = GenStateCompleted;
          // Dispatch the exception by looping back around to the
          // context.dispatchException(context.arg) call above.
          context.method = "throw";
          context.arg = record.arg;
        }
      }
    };
  }

  // Call delegate.iterator[context.method](context.arg) and handle the
  // result, either by returning a { value, done } result from the
  // delegate iterator, or by modifying context.method and context.arg,
  // setting context.delegate to null, and returning the ContinueSentinel.
  function maybeInvokeDelegate(delegate, context) {
    var method = delegate.iterator[context.method];
    if (method === undefined) {
      // A .throw or .return when the delegate iterator has no .throw
      // method always terminates the yield* loop.
      context.delegate = null;

      if (context.method === "throw") {
        // Note: ["return"] must be used for ES3 parsing compatibility.
        if (delegate.iterator["return"]) {
          // If the delegate iterator has a return method, give it a
          // chance to clean up.
          context.method = "return";
          context.arg = undefined;
          maybeInvokeDelegate(delegate, context);

          if (context.method === "throw") {
            // If maybeInvokeDelegate(context) changed context.method from
            // "return" to "throw", let that override the TypeError below.
            return ContinueSentinel;
          }
        }

        context.method = "throw";
        context.arg = new TypeError(
          "The iterator does not provide a 'throw' method");
      }

      return ContinueSentinel;
    }

    var record = tryCatch(method, delegate.iterator, context.arg);

    if (record.type === "throw") {
      context.method = "throw";
      context.arg = record.arg;
      context.delegate = null;
      return ContinueSentinel;
    }

    var info = record.arg;

    if (! info) {
      context.method = "throw";
      context.arg = new TypeError("iterator result is not an object");
      context.delegate = null;
      return ContinueSentinel;
    }

    if (info.done) {
      // Assign the result of the finished delegate to the temporary
      // variable specified by delegate.resultName (see delegateYield).
      context[delegate.resultName] = info.value;

      // Resume execution at the desired location (see delegateYield).
      context.next = delegate.nextLoc;

      // If context.method was "throw" but the delegate handled the
      // exception, let the outer generator proceed normally. If
      // context.method was "next", forget context.arg since it has been
      // "consumed" by the delegate iterator. If context.method was
      // "return", allow the original .return call to continue in the
      // outer generator.
      if (context.method !== "return") {
        context.method = "next";
        context.arg = undefined;
      }

    } else {
      // Re-yield the result returned by the delegate method.
      return info;
    }

    // The delegate iterator is finished, so forget it and continue with
    // the outer generator.
    context.delegate = null;
    return ContinueSentinel;
  }

  // Define Generator.prototype.{next,throw,return} in terms of the
  // unified ._invoke helper method.
  defineIteratorMethods(Gp);

  define(Gp, toStringTagSymbol, "Generator");

  // A Generator should always return itself as the iterator object when the
  // @@iterator function is called on it. Some browsers' implementations of the
  // iterator prototype chain incorrectly implement this, causing the Generator
  // object to not be returned from this call. This ensures that doesn't happen.
  // See https://github.com/facebook/regenerator/issues/274 for more details.
  define(Gp, iteratorSymbol, function() {
    return this;
  });

  define(Gp, "toString", function() {
    return "[object Generator]";
  });

  function pushTryEntry(locs) {
    var entry = { tryLoc: locs[0] };

    if (1 in locs) {
      entry.catchLoc = locs[1];
    }

    if (2 in locs) {
      entry.finallyLoc = locs[2];
      entry.afterLoc = locs[3];
    }

    this.tryEntries.push(entry);
  }

  function resetTryEntry(entry) {
    var record = entry.completion || {};
    record.type = "normal";
    delete record.arg;
    entry.completion = record;
  }

  function Context(tryLocsList) {
    // The root entry object (effectively a try statement without a catch
    // or a finally block) gives us a place to store values thrown from
    // locations where there is no enclosing try statement.
    this.tryEntries = [{ tryLoc: "root" }];
    tryLocsList.forEach(pushTryEntry, this);
    this.reset(true);
  }

  exports.keys = function(object) {
    var keys = [];
    for (var key in object) {
      keys.push(key);
    }
    keys.reverse();

    // Rather than returning an object with a next method, we keep
    // things simple and return the next function itself.
    return function next() {
      while (keys.length) {
        var key = keys.pop();
        if (key in object) {
          next.value = key;
          next.done = false;
          return next;
        }
      }

      // To avoid creating an additional object, we just hang the .value
      // and .done properties off the next function object itself. This
      // also ensures that the minifier will not anonymize the function.
      next.done = true;
      return next;
    };
  };

  function values(iterable) {
    if (iterable) {
      var iteratorMethod = iterable[iteratorSymbol];
      if (iteratorMethod) {
        return iteratorMethod.call(iterable);
      }

      if (typeof iterable.next === "function") {
        return iterable;
      }

      if (!isNaN(iterable.length)) {
        var i = -1, next = function next() {
          while (++i < iterable.length) {
            if (hasOwn.call(iterable, i)) {
              next.value = iterable[i];
              next.done = false;
              return next;
            }
          }

          next.value = undefined;
          next.done = true;

          return next;
        };

        return next.next = next;
      }
    }

    // Return an iterator with no values.
    return { next: doneResult };
  }
  exports.values = values;

  function doneResult() {
    return { value: undefined, done: true };
  }

  Context.prototype = {
    constructor: Context,

    reset: function(skipTempReset) {
      this.prev = 0;
      this.next = 0;
      // Resetting context._sent for legacy support of Babel's
      // function.sent implementation.
      this.sent = this._sent = undefined;
      this.done = false;
      this.delegate = null;

      this.method = "next";
      this.arg = undefined;

      this.tryEntries.forEach(resetTryEntry);

      if (!skipTempReset) {
        for (var name in this) {
          // Not sure about the optimal order of these conditions:
          if (name.charAt(0) === "t" &&
              hasOwn.call(this, name) &&
              !isNaN(+name.slice(1))) {
            this[name] = undefined;
          }
        }
      }
    },

    stop: function() {
      this.done = true;

      var rootEntry = this.tryEntries[0];
      var rootRecord = rootEntry.completion;
      if (rootRecord.type === "throw") {
        throw rootRecord.arg;
      }

      return this.rval;
    },

    dispatchException: function(exception) {
      if (this.done) {
        throw exception;
      }

      var context = this;
      function handle(loc, caught) {
        record.type = "throw";
        record.arg = exception;
        context.next = loc;

        if (caught) {
          // If the dispatched exception was caught by a catch block,
          // then let that catch block handle the exception normally.
          context.method = "next";
          context.arg = undefined;
        }

        return !! caught;
      }

      for (var i = this.tryEntries.length - 1; i >= 0; --i) {
        var entry = this.tryEntries[i];
        var record = entry.completion;

        if (entry.tryLoc === "root") {
          // Exception thrown outside of any try block that could handle
          // it, so set the completion value of the entire function to
          // throw the exception.
          return handle("end");
        }

        if (entry.tryLoc <= this.prev) {
          var hasCatch = hasOwn.call(entry, "catchLoc");
          var hasFinally = hasOwn.call(entry, "finallyLoc");

          if (hasCatch && hasFinally) {
            if (this.prev < entry.catchLoc) {
              return handle(entry.catchLoc, true);
            } else if (this.prev < entry.finallyLoc) {
              return handle(entry.finallyLoc);
            }

          } else if (hasCatch) {
            if (this.prev < entry.catchLoc) {
              return handle(entry.catchLoc, true);
            }

          } else if (hasFinally) {
            if (this.prev < entry.finallyLoc) {
              return handle(entry.finallyLoc);
            }

          } else {
            throw new Error("try statement without catch or finally");
          }
        }
      }
    },

    abrupt: function(type, arg) {
      for (var i = this.tryEntries.length - 1; i >= 0; --i) {
        var entry = this.tryEntries[i];
        if (entry.tryLoc <= this.prev &&
            hasOwn.call(entry, "finallyLoc") &&
            this.prev < entry.finallyLoc) {
          var finallyEntry = entry;
          break;
        }
      }

      if (finallyEntry &&
          (type === "break" ||
           type === "continue") &&
          finallyEntry.tryLoc <= arg &&
          arg <= finallyEntry.finallyLoc) {
        // Ignore the finally entry if control is not jumping to a
        // location outside the try/catch block.
        finallyEntry = null;
      }

      var record = finallyEntry ? finallyEntry.completion : {};
      record.type = type;
      record.arg = arg;

      if (finallyEntry) {
        this.method = "next";
        this.next = finallyEntry.finallyLoc;
        return ContinueSentinel;
      }

      return this.complete(record);
    },

    complete: function(record, afterLoc) {
      if (record.type === "throw") {
        throw record.arg;
      }

      if (record.type === "break" ||
          record.type === "continue") {
        this.next = record.arg;
      } else if (record.type === "return") {
        this.rval = this.arg = record.arg;
        this.method = "return";
        this.next = "end";
      } else if (record.type === "normal" && afterLoc) {
        this.next = afterLoc;
      }

      return ContinueSentinel;
    },

    finish: function(finallyLoc) {
      for (var i = this.tryEntries.length - 1; i >= 0; --i) {
        var entry = this.tryEntries[i];
        if (entry.finallyLoc === finallyLoc) {
          this.complete(entry.completion, entry.afterLoc);
          resetTryEntry(entry);
          return ContinueSentinel;
        }
      }
    },

    "catch": function(tryLoc) {
      for (var i = this.tryEntries.length - 1; i >= 0; --i) {
        var entry = this.tryEntries[i];
        if (entry.tryLoc === tryLoc) {
          var record = entry.completion;
          if (record.type === "throw") {
            var thrown = record.arg;
            resetTryEntry(entry);
          }
          return thrown;
        }
      }

      // The context.catch method must only be called with a location
      // argument that corresponds to a known catch block.
      throw new Error("illegal catch attempt");
    },

    delegateYield: function(iterable, resultName, nextLoc) {
      this.delegate = {
        iterator: values(iterable),
        resultName: resultName,
        nextLoc: nextLoc
      };

      if (this.method === "next") {
        // Deliberately forget the last sent value so that we don't
        // accidentally pass it on to the delegate.
        this.arg = undefined;
      }

      return ContinueSentinel;
    }
  };

  // Regardless of whether this script is executing as a CommonJS module
  // or not, return the runtime object so that we can declare the variable
  // regeneratorRuntime in the outer scope, which allows this module to be
  // injected easily by `bin/regenerator --include-runtime script.js`.
  return exports;

}(
  // If this script is executing as a CommonJS module, use module.exports
  // as the regeneratorRuntime namespace. Otherwise create a new empty
  // object. Either way, the resulting object will be used to initialize
  // the regeneratorRuntime variable at the top of this file.
  typeof module === "object" ? module.exports : {}
));

try {
  regeneratorRuntime = runtime;
} catch (accidentalStrictMode) {
  // This module should not be running in strict mode, so the above
  // assignment should always work unless something is misconfigured. Just
  // in case runtime.js accidentally runs in strict mode, in modern engines
  // we can explicitly access globalThis. In older engines we can escape
  // strict mode using a global Function call. This could conceivably fail
  // if a Content Security Policy forbids using Function, but in that case
  // the proper solution is to fix the accidental strict mode problem. If
  // you've misconfigured your bundler to force strict mode and applied a
  // CSP to forbid Function, and you're not willing to fix either of those
  // problems, please detail your unique predicament in a GitHub issue.
  if (typeof globalThis === "object") {
    globalThis.regeneratorRuntime = runtime;
  } else {
    Function("r", "regeneratorRuntime = r")(runtime);
  }
}

},{}],"node_modules/process/browser.js":[function(require,module,exports) {

// shim for using process in browser
var process = module.exports = {}; // cached from whatever global is present so that test runners that stub it
// don't break things.  But we need to wrap it in a try catch in case it is
// wrapped in strict mode code which doesn't define any globals.  It's inside a
// function because try/catches deoptimize in certain engines.

var cachedSetTimeout;
var cachedClearTimeout;

function defaultSetTimout() {
  throw new Error('setTimeout has not been defined');
}

function defaultClearTimeout() {
  throw new Error('clearTimeout has not been defined');
}

(function () {
  try {
    if (typeof setTimeout === 'function') {
      cachedSetTimeout = setTimeout;
    } else {
      cachedSetTimeout = defaultSetTimout;
    }
  } catch (e) {
    cachedSetTimeout = defaultSetTimout;
  }

  try {
    if (typeof clearTimeout === 'function') {
      cachedClearTimeout = clearTimeout;
    } else {
      cachedClearTimeout = defaultClearTimeout;
    }
  } catch (e) {
    cachedClearTimeout = defaultClearTimeout;
  }
})();

function runTimeout(fun) {
  if (cachedSetTimeout === setTimeout) {
    //normal enviroments in sane situations
    return setTimeout(fun, 0);
  } // if setTimeout wasn't available but was latter defined


  if ((cachedSetTimeout === defaultSetTimout || !cachedSetTimeout) && setTimeout) {
    cachedSetTimeout = setTimeout;
    return setTimeout(fun, 0);
  }

  try {
    // when when somebody has screwed with setTimeout but no I.E. maddness
    return cachedSetTimeout(fun, 0);
  } catch (e) {
    try {
      // When we are in I.E. but the script has been evaled so I.E. doesn't trust the global object when called normally
      return cachedSetTimeout.call(null, fun, 0);
    } catch (e) {
      // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error
      return cachedSetTimeout.call(this, fun, 0);
    }
  }
}

function runClearTimeout(marker) {
  if (cachedClearTimeout === clearTimeout) {
    //normal enviroments in sane situations
    return clearTimeout(marker);
  } // if clearTimeout wasn't available but was latter defined


  if ((cachedClearTimeout === defaultClearTimeout || !cachedClearTimeout) && clearTimeout) {
    cachedClearTimeout = clearTimeout;
    return clearTimeout(marker);
  }

  try {
    // when when somebody has screwed with setTimeout but no I.E. maddness
    return cachedClearTimeout(marker);
  } catch (e) {
    try {
      // When we are in I.E. but the script has been evaled so I.E. doesn't  trust the global object when called normally
      return cachedClearTimeout.call(null, marker);
    } catch (e) {
      // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error.
      // Some versions of I.E. have different rules for clearTimeout vs setTimeout
      return cachedClearTimeout.call(this, marker);
    }
  }
}

var queue = [];
var draining = false;
var currentQueue;
var queueIndex = -1;

function cleanUpNextTick() {
  if (!draining || !currentQueue) {
    return;
  }

  draining = false;

  if (currentQueue.length) {
    queue = currentQueue.concat(queue);
  } else {
    queueIndex = -1;
  }

  if (queue.length) {
    drainQueue();
  }
}

function drainQueue() {
  if (draining) {
    return;
  }

  var timeout = runTimeout(cleanUpNextTick);
  draining = true;
  var len = queue.length;

  while (len) {
    currentQueue = queue;
    queue = [];

    while (++queueIndex < len) {
      if (currentQueue) {
        currentQueue[queueIndex].run();
      }
    }

    queueIndex = -1;
    len = queue.length;
  }

  currentQueue = null;
  draining = false;
  runClearTimeout(timeout);
}

process.nextTick = function (fun) {
  var args = new Array(arguments.length - 1);

  if (arguments.length > 1) {
    for (var i = 1; i < arguments.length; i++) {
      args[i - 1] = arguments[i];
    }
  }

  queue.push(new Item(fun, args));

  if (queue.length === 1 && !draining) {
    runTimeout(drainQueue);
  }
}; // v8 likes predictible objects


function Item(fun, array) {
  this.fun = fun;
  this.array = array;
}

Item.prototype.run = function () {
  this.fun.apply(null, this.array);
};

process.title = 'browser';
process.env = {};
process.argv = [];
process.version = ''; // empty string to avoid regexp issues

process.versions = {};

function noop() {}

process.on = noop;
process.addListener = noop;
process.once = noop;
process.off = noop;
process.removeListener = noop;
process.removeAllListeners = noop;
process.emit = noop;
process.prependListener = noop;
process.prependOnceListener = noop;

process.listeners = function (name) {
  return [];
};

process.binding = function (name) {
  throw new Error('process.binding is not supported');
};

process.cwd = function () {
  return '/';
};

process.chdir = function (dir) {
  throw new Error('process.chdir is not supported');
};

process.umask = function () {
  return 0;
};
},{}],"node_modules/@fnndsc/chrisapi/dist/chrisapi.js":[function(require,module,exports) {
var define;
var process = require("process");
!function(t,e){"object"==typeof exports&&"object"==typeof module?module.exports=e():"function"==typeof define&&define.amd?define("CAPI",[],e):"object"==typeof exports?exports.CAPI=e():t.CAPI=e()}(self,(function(){return(()=>{var t={9669:(t,e,n)=>{t.exports=n(1609)},5448:(t,e,n)=>{"use strict";var r=n(4867),o=n(6026),i=n(4372),u=n(5327),c=n(4097),a=n(4109),s=n(7985),l=n(5061),f=n(7874),p=n(5263);t.exports=function(t){return new Promise((function(e,n){var h,v=t.data,y=t.headers,d=t.responseType;function g(){t.cancelToken&&t.cancelToken.unsubscribe(h),t.signal&&t.signal.removeEventListener("abort",h)}r.isFormData(v)&&delete y["Content-Type"];var b=new XMLHttpRequest;if(t.auth){var m=t.auth.username||"",w=t.auth.password?unescape(encodeURIComponent(t.auth.password)):"";y.Authorization="Basic "+btoa(m+":"+w)}var O=c(t.baseURL,t.url);function P(){if(b){var r="getAllResponseHeaders"in b?a(b.getAllResponseHeaders()):null,i={data:d&&"text"!==d&&"json"!==d?b.response:b.responseText,status:b.status,statusText:b.statusText,headers:r,config:t,request:b};o((function(t){e(t),g()}),(function(t){n(t),g()}),i),b=null}}if(b.open(t.method.toUpperCase(),u(O,t.params,t.paramsSerializer),!0),b.timeout=t.timeout,"onloadend"in b?b.onloadend=P:b.onreadystatechange=function(){b&&4===b.readyState&&(0!==b.status||b.responseURL&&0===b.responseURL.indexOf("file:"))&&setTimeout(P)},b.onabort=function(){b&&(n(l("Request aborted",t,"ECONNABORTED",b)),b=null)},b.onerror=function(){n(l("Network Error",t,null,b)),b=null},b.ontimeout=function(){var e=t.timeout?"timeout of "+t.timeout+"ms exceeded":"timeout exceeded",r=t.transitional||f;t.timeoutErrorMessage&&(e=t.timeoutErrorMessage),n(l(e,t,r.clarifyTimeoutError?"ETIMEDOUT":"ECONNABORTED",b)),b=null},r.isStandardBrowserEnv()){var _=(t.withCredentials||s(O))&&t.xsrfCookieName?i.read(t.xsrfCookieName):void 0;_&&(y[t.xsrfHeaderName]=_)}"setRequestHeader"in b&&r.forEach(y,(function(t,e){void 0===v&&"content-type"===e.toLowerCase()?delete y[e]:b.setRequestHeader(e,t)})),r.isUndefined(t.withCredentials)||(b.withCredentials=!!t.withCredentials),d&&"json"!==d&&(b.responseType=t.responseType),"function"==typeof t.onDownloadProgress&&b.addEventListener("progress",t.onDownloadProgress),"function"==typeof t.onUploadProgress&&b.upload&&b.upload.addEventListener("progress",t.onUploadProgress),(t.cancelToken||t.signal)&&(h=function(t){b&&(n(!t||t&&t.type?new p("canceled"):t),b.abort(),b=null)},t.cancelToken&&t.cancelToken.subscribe(h),t.signal&&(t.signal.aborted?h():t.signal.addEventListener("abort",h))),v||(v=null),b.send(v)}))}},1609:(t,e,n)=>{"use strict";var r=n(4867),o=n(1849),i=n(321),u=n(7185),c=function t(e){var n=new i(e),c=o(i.prototype.request,n);return r.extend(c,i.prototype,n),r.extend(c,n),c.create=function(n){return t(u(e,n))},c}(n(5546));c.Axios=i,c.Cancel=n(5263),c.CancelToken=n(4972),c.isCancel=n(6502),c.VERSION=n(7288).version,c.all=function(t){return Promise.all(t)},c.spread=n(8713),c.isAxiosError=n(6268),t.exports=c,t.exports.default=c},5263:t=>{"use strict";function e(t){this.message=t}e.prototype.toString=function(){return"Cancel"+(this.message?": "+this.message:"")},e.prototype.__CANCEL__=!0,t.exports=e},4972:(t,e,n)=>{"use strict";var r=n(5263);function o(t){if("function"!=typeof t)throw new TypeError("executor must be a function.");var e;this.promise=new Promise((function(t){e=t}));var n=this;this.promise.then((function(t){if(n._listeners){var e,r=n._listeners.length;for(e=0;e<r;e++)n._listeners[e](t);n._listeners=null}})),this.promise.then=function(t){var e,r=new Promise((function(t){n.subscribe(t),e=t})).then(t);return r.cancel=function(){n.unsubscribe(e)},r},t((function(t){n.reason||(n.reason=new r(t),e(n.reason))}))}o.prototype.throwIfRequested=function(){if(this.reason)throw this.reason},o.prototype.subscribe=function(t){this.reason?t(this.reason):this._listeners?this._listeners.push(t):this._listeners=[t]},o.prototype.unsubscribe=function(t){if(this._listeners){var e=this._listeners.indexOf(t);-1!==e&&this._listeners.splice(e,1)}},o.source=function(){var t;return{token:new o((function(e){t=e})),cancel:t}},t.exports=o},6502:t=>{"use strict";t.exports=function(t){return!(!t||!t.__CANCEL__)}},321:(t,e,n)=>{"use strict";var r=n(4867),o=n(5327),i=n(782),u=n(3572),c=n(7185),a=n(4875),s=a.validators;function l(t){this.defaults=t,this.interceptors={request:new i,response:new i}}l.prototype.request=function(t,e){"string"==typeof t?(e=e||{}).url=t:e=t||{},(e=c(this.defaults,e)).method?e.method=e.method.toLowerCase():this.defaults.method?e.method=this.defaults.method.toLowerCase():e.method="get";var n=e.transitional;void 0!==n&&a.assertOptions(n,{silentJSONParsing:s.transitional(s.boolean),forcedJSONParsing:s.transitional(s.boolean),clarifyTimeoutError:s.transitional(s.boolean)},!1);var r=[],o=!0;this.interceptors.request.forEach((function(t){"function"==typeof t.runWhen&&!1===t.runWhen(e)||(o=o&&t.synchronous,r.unshift(t.fulfilled,t.rejected))}));var i,l=[];if(this.interceptors.response.forEach((function(t){l.push(t.fulfilled,t.rejected)})),!o){var f=[u,void 0];for(Array.prototype.unshift.apply(f,r),f=f.concat(l),i=Promise.resolve(e);f.length;)i=i.then(f.shift(),f.shift());return i}for(var p=e;r.length;){var h=r.shift(),v=r.shift();try{p=h(p)}catch(t){v(t);break}}try{i=u(p)}catch(t){return Promise.reject(t)}for(;l.length;)i=i.then(l.shift(),l.shift());return i},l.prototype.getUri=function(t){return t=c(this.defaults,t),o(t.url,t.params,t.paramsSerializer).replace(/^\?/,"")},r.forEach(["delete","get","head","options"],(function(t){l.prototype[t]=function(e,n){return this.request(c(n||{},{method:t,url:e,data:(n||{}).data}))}})),r.forEach(["post","put","patch"],(function(t){l.prototype[t]=function(e,n,r){return this.request(c(r||{},{method:t,url:e,data:n}))}})),t.exports=l},782:(t,e,n)=>{"use strict";var r=n(4867);function o(){this.handlers=[]}o.prototype.use=function(t,e,n){return this.handlers.push({fulfilled:t,rejected:e,synchronous:!!n&&n.synchronous,runWhen:n?n.runWhen:null}),this.handlers.length-1},o.prototype.eject=function(t){this.handlers[t]&&(this.handlers[t]=null)},o.prototype.forEach=function(t){r.forEach(this.handlers,(function(e){null!==e&&t(e)}))},t.exports=o},4097:(t,e,n)=>{"use strict";var r=n(1793),o=n(7303);t.exports=function(t,e){return t&&!r(e)?o(t,e):e}},5061:(t,e,n)=>{"use strict";var r=n(481);t.exports=function(t,e,n,o,i){var u=new Error(t);return r(u,e,n,o,i)}},3572:(t,e,n)=>{"use strict";var r=n(4867),o=n(8527),i=n(6502),u=n(5546),c=n(5263);function a(t){if(t.cancelToken&&t.cancelToken.throwIfRequested(),t.signal&&t.signal.aborted)throw new c("canceled")}t.exports=function(t){return a(t),t.headers=t.headers||{},t.data=o.call(t,t.data,t.headers,t.transformRequest),t.headers=r.merge(t.headers.common||{},t.headers[t.method]||{},t.headers),r.forEach(["delete","get","head","post","put","patch","common"],(function(e){delete t.headers[e]})),(t.adapter||u.adapter)(t).then((function(e){return a(t),e.data=o.call(t,e.data,e.headers,t.transformResponse),e}),(function(e){return i(e)||(a(t),e&&e.response&&(e.response.data=o.call(t,e.response.data,e.response.headers,t.transformResponse))),Promise.reject(e)}))}},481:t=>{"use strict";t.exports=function(t,e,n,r,o){return t.config=e,n&&(t.code=n),t.request=r,t.response=o,t.isAxiosError=!0,t.toJSON=function(){return{message:this.message,name:this.name,description:this.description,number:this.number,fileName:this.fileName,lineNumber:this.lineNumber,columnNumber:this.columnNumber,stack:this.stack,config:this.config,code:this.code,status:this.response&&this.response.status?this.response.status:null}},t}},7185:(t,e,n)=>{"use strict";var r=n(4867);t.exports=function(t,e){e=e||{};var n={};function o(t,e){return r.isPlainObject(t)&&r.isPlainObject(e)?r.merge(t,e):r.isPlainObject(e)?r.merge({},e):r.isArray(e)?e.slice():e}function i(n){return r.isUndefined(e[n])?r.isUndefined(t[n])?void 0:o(void 0,t[n]):o(t[n],e[n])}function u(t){if(!r.isUndefined(e[t]))return o(void 0,e[t])}function c(n){return r.isUndefined(e[n])?r.isUndefined(t[n])?void 0:o(void 0,t[n]):o(void 0,e[n])}function a(n){return n in e?o(t[n],e[n]):n in t?o(void 0,t[n]):void 0}var s={url:u,method:u,data:u,baseURL:c,transformRequest:c,transformResponse:c,paramsSerializer:c,timeout:c,timeoutMessage:c,withCredentials:c,adapter:c,responseType:c,xsrfCookieName:c,xsrfHeaderName:c,onUploadProgress:c,onDownloadProgress:c,decompress:c,maxContentLength:c,maxBodyLength:c,transport:c,httpAgent:c,httpsAgent:c,cancelToken:c,socketPath:c,responseEncoding:c,validateStatus:a};return r.forEach(Object.keys(t).concat(Object.keys(e)),(function(t){var e=s[t]||i,o=e(t);r.isUndefined(o)&&e!==a||(n[t]=o)})),n}},6026:(t,e,n)=>{"use strict";var r=n(5061);t.exports=function(t,e,n){var o=n.config.validateStatus;n.status&&o&&!o(n.status)?e(r("Request failed with status code "+n.status,n.config,null,n.request,n)):t(n)}},8527:(t,e,n)=>{"use strict";var r=n(4867),o=n(5546);t.exports=function(t,e,n){var i=this||o;return r.forEach(n,(function(n){t=n.call(i,t,e)})),t}},5546:(t,e,n)=>{"use strict";var r=n(4867),o=n(6016),i=n(481),u=n(7874),c={"Content-Type":"application/x-www-form-urlencoded"};function a(t,e){!r.isUndefined(t)&&r.isUndefined(t["Content-Type"])&&(t["Content-Type"]=e)}var s,l={transitional:u,adapter:(("undefined"!=typeof XMLHttpRequest||"undefined"!=typeof process&&"[object process]"===Object.prototype.toString.call(process))&&(s=n(5448)),s),transformRequest:[function(t,e){return o(e,"Accept"),o(e,"Content-Type"),r.isFormData(t)||r.isArrayBuffer(t)||r.isBuffer(t)||r.isStream(t)||r.isFile(t)||r.isBlob(t)?t:r.isArrayBufferView(t)?t.buffer:r.isURLSearchParams(t)?(a(e,"application/x-www-form-urlencoded;charset=utf-8"),t.toString()):r.isObject(t)||e&&"application/json"===e["Content-Type"]?(a(e,"application/json"),function(t,e,n){if(r.isString(t))try{return(0,JSON.parse)(t),r.trim(t)}catch(t){if("SyntaxError"!==t.name)throw t}return(0,JSON.stringify)(t)}(t)):t}],transformResponse:[function(t){var e=this.transitional||l.transitional,n=e&&e.silentJSONParsing,o=e&&e.forcedJSONParsing,u=!n&&"json"===this.responseType;if(u||o&&r.isString(t)&&t.length)try{return JSON.parse(t)}catch(t){if(u){if("SyntaxError"===t.name)throw i(t,this,"E_JSON_PARSE");throw t}}return t}],timeout:0,xsrfCookieName:"XSRF-TOKEN",xsrfHeaderName:"X-XSRF-TOKEN",maxContentLength:-1,maxBodyLength:-1,validateStatus:function(t){return t>=200&&t<300},headers:{common:{Accept:"application/json, text/plain, */*"}}};r.forEach(["delete","get","head"],(function(t){l.headers[t]={}})),r.forEach(["post","put","patch"],(function(t){l.headers[t]=r.merge(c)})),t.exports=l},7874:t=>{"use strict";t.exports={silentJSONParsing:!0,forcedJSONParsing:!0,clarifyTimeoutError:!1}},7288:t=>{t.exports={version:"0.26.1"}},1849:t=>{"use strict";t.exports=function(t,e){return function(){for(var n=new Array(arguments.length),r=0;r<n.length;r++)n[r]=arguments[r];return t.apply(e,n)}}},5327:(t,e,n)=>{"use strict";var r=n(4867);function o(t){return encodeURIComponent(t).replace(/%3A/gi,":").replace(/%24/g,"$").replace(/%2C/gi,",").replace(/%20/g,"+").replace(/%5B/gi,"[").replace(/%5D/gi,"]")}t.exports=function(t,e,n){if(!e)return t;var i;if(n)i=n(e);else if(r.isURLSearchParams(e))i=e.toString();else{var u=[];r.forEach(e,(function(t,e){null!=t&&(r.isArray(t)?e+="[]":t=[t],r.forEach(t,(function(t){r.isDate(t)?t=t.toISOString():r.isObject(t)&&(t=JSON.stringify(t)),u.push(o(e)+"="+o(t))})))})),i=u.join("&")}if(i){var c=t.indexOf("#");-1!==c&&(t=t.slice(0,c)),t+=(-1===t.indexOf("?")?"?":"&")+i}return t}},7303:t=>{"use strict";t.exports=function(t,e){return e?t.replace(/\/+$/,"")+"/"+e.replace(/^\/+/,""):t}},4372:(t,e,n)=>{"use strict";var r=n(4867);t.exports=r.isStandardBrowserEnv()?{write:function(t,e,n,o,i,u){var c=[];c.push(t+"="+encodeURIComponent(e)),r.isNumber(n)&&c.push("expires="+new Date(n).toGMTString()),r.isString(o)&&c.push("path="+o),r.isString(i)&&c.push("domain="+i),!0===u&&c.push("secure"),document.cookie=c.join("; ")},read:function(t){var e=document.cookie.match(new RegExp("(^|;\\s*)("+t+")=([^;]*)"));return e?decodeURIComponent(e[3]):null},remove:function(t){this.write(t,"",Date.now()-864e5)}}:{write:function(){},read:function(){return null},remove:function(){}}},1793:t=>{"use strict";t.exports=function(t){return/^([a-z][a-z\d+\-.]*:)?\/\//i.test(t)}},6268:(t,e,n)=>{"use strict";var r=n(4867);t.exports=function(t){return r.isObject(t)&&!0===t.isAxiosError}},7985:(t,e,n)=>{"use strict";var r=n(4867);t.exports=r.isStandardBrowserEnv()?function(){var t,e=/(msie|trident)/i.test(navigator.userAgent),n=document.createElement("a");function o(t){var r=t;return e&&(n.setAttribute("href",r),r=n.href),n.setAttribute("href",r),{href:n.href,protocol:n.protocol?n.protocol.replace(/:$/,""):"",host:n.host,search:n.search?n.search.replace(/^\?/,""):"",hash:n.hash?n.hash.replace(/^#/,""):"",hostname:n.hostname,port:n.port,pathname:"/"===n.pathname.charAt(0)?n.pathname:"/"+n.pathname}}return t=o(window.location.href),function(e){var n=r.isString(e)?o(e):e;return n.protocol===t.protocol&&n.host===t.host}}():function(){return!0}},6016:(t,e,n)=>{"use strict";var r=n(4867);t.exports=function(t,e){r.forEach(t,(function(n,r){r!==e&&r.toUpperCase()===e.toUpperCase()&&(t[e]=n,delete t[r])}))}},4109:(t,e,n)=>{"use strict";var r=n(4867),o=["age","authorization","content-length","content-type","etag","expires","from","host","if-modified-since","if-unmodified-since","last-modified","location","max-forwards","proxy-authorization","referer","retry-after","user-agent"];t.exports=function(t){var e,n,i,u={};return t?(r.forEach(t.split("\n"),(function(t){if(i=t.indexOf(":"),e=r.trim(t.substr(0,i)).toLowerCase(),n=r.trim(t.substr(i+1)),e){if(u[e]&&o.indexOf(e)>=0)return;u[e]="set-cookie"===e?(u[e]?u[e]:[]).concat([n]):u[e]?u[e]+", "+n:n}})),u):u}},8713:t=>{"use strict";t.exports=function(t){return function(e){return t.apply(null,e)}}},4875:(t,e,n)=>{"use strict";var r=n(7288).version,o={};["object","boolean","number","function","string","symbol"].forEach((function(t,e){o[t]=function(n){return typeof n===t||"a"+(e<1?"n ":" ")+t}}));var i={};o.transitional=function(t,e,n){function o(t,e){return"[Axios v"+r+"] Transitional option '"+t+"'"+e+(n?". "+n:"")}return function(n,r,u){if(!1===t)throw new Error(o(r," has been removed"+(e?" in "+e:"")));return e&&!i[r]&&(i[r]=!0,console.warn(o(r," has been deprecated since v"+e+" and will be removed in the near future"))),!t||t(n,r,u)}},t.exports={assertOptions:function(t,e,n){if("object"!=typeof t)throw new TypeError("options must be an object");for(var r=Object.keys(t),o=r.length;o-- >0;){var i=r[o],u=e[i];if(u){var c=t[i],a=void 0===c||u(c,i,t);if(!0!==a)throw new TypeError("option "+i+" must be "+a)}else if(!0!==n)throw Error("Unknown option "+i)}},validators:o}},4867:(t,e,n)=>{"use strict";var r=n(1849),o=Object.prototype.toString;function i(t){return Array.isArray(t)}function u(t){return void 0===t}function c(t){return"[object ArrayBuffer]"===o.call(t)}function a(t){return null!==t&&"object"==typeof t}function s(t){if("[object Object]"!==o.call(t))return!1;var e=Object.getPrototypeOf(t);return null===e||e===Object.prototype}function l(t){return"[object Function]"===o.call(t)}function f(t,e){if(null!=t)if("object"!=typeof t&&(t=[t]),i(t))for(var n=0,r=t.length;n<r;n++)e.call(null,t[n],n,t);else for(var o in t)Object.prototype.hasOwnProperty.call(t,o)&&e.call(null,t[o],o,t)}t.exports={isArray:i,isArrayBuffer:c,isBuffer:function(t){return null!==t&&!u(t)&&null!==t.constructor&&!u(t.constructor)&&"function"==typeof t.constructor.isBuffer&&t.constructor.isBuffer(t)},isFormData:function(t){return"[object FormData]"===o.call(t)},isArrayBufferView:function(t){return"undefined"!=typeof ArrayBuffer&&ArrayBuffer.isView?ArrayBuffer.isView(t):t&&t.buffer&&c(t.buffer)},isString:function(t){return"string"==typeof t},isNumber:function(t){return"number"==typeof t},isObject:a,isPlainObject:s,isUndefined:u,isDate:function(t){return"[object Date]"===o.call(t)},isFile:function(t){return"[object File]"===o.call(t)},isBlob:function(t){return"[object Blob]"===o.call(t)},isFunction:l,isStream:function(t){return a(t)&&l(t.pipe)},isURLSearchParams:function(t){return"[object URLSearchParams]"===o.call(t)},isStandardBrowserEnv:function(){return("undefined"==typeof navigator||"ReactNative"!==navigator.product&&"NativeScript"!==navigator.product&&"NS"!==navigator.product)&&"undefined"!=typeof window&&"undefined"!=typeof document},forEach:f,merge:function t(){var e={};function n(n,r){s(e[r])&&s(n)?e[r]=t(e[r],n):s(n)?e[r]=t({},n):i(n)?e[r]=n.slice():e[r]=n}for(var r=0,o=arguments.length;r<o;r++)f(arguments[r],n);return e},extend:function(t,e,n){return f(e,(function(e,o){t[o]=n&&"function"==typeof e?r(e,n):e})),t},trim:function(t){return t.trim?t.trim():t.replace(/^\s+|\s+$/g,"")},stripBOM:function(t){return 65279===t.charCodeAt(0)&&(t=t.slice(1)),t}}},9662:(t,e,n)=>{var r=n(7854),o=n(614),i=n(6330),u=r.TypeError;t.exports=function(t){if(o(t))return t;throw u(i(t)+" is not a function")}},9483:(t,e,n)=>{var r=n(7854),o=n(4411),i=n(6330),u=r.TypeError;t.exports=function(t){if(o(t))return t;throw u(i(t)+" is not a constructor")}},6077:(t,e,n)=>{var r=n(7854),o=n(614),i=r.String,u=r.TypeError;t.exports=function(t){if("object"==typeof t||o(t))return t;throw u("Can't set "+i(t)+" as a prototype")}},1223:(t,e,n)=>{var r=n(5112),o=n(30),i=n(3070),u=r("unscopables"),c=Array.prototype;null==c[u]&&i.f(c,u,{configurable:!0,value:o(null)}),t.exports=function(t){c[u][t]=!0}},5787:(t,e,n)=>{var r=n(7854),o=n(7976),i=r.TypeError;t.exports=function(t,e){if(o(e,t))return t;throw i("Incorrect invocation")}},9670:(t,e,n)=>{var r=n(7854),o=n(111),i=r.String,u=r.TypeError;t.exports=function(t){if(o(t))return t;throw u(i(t)+" is not an object")}},7556:(t,e,n)=>{var r=n(7293);t.exports=r((function(){if("function"==typeof ArrayBuffer){var t=new ArrayBuffer(8);Object.isExtensible(t)&&Object.defineProperty(t,"a",{value:8})}}))},8457:(t,e,n)=>{"use strict";var r=n(7854),o=n(9974),i=n(6916),u=n(7908),c=n(3411),a=n(7659),s=n(4411),l=n(6244),f=n(6135),p=n(8554),h=n(1246),v=r.Array;t.exports=function(t){var e=u(t),n=s(this),r=arguments.length,y=r>1?arguments[1]:void 0,d=void 0!==y;d&&(y=o(y,r>2?arguments[2]:void 0));var g,b,m,w,O,P,_=h(e),j=0;if(!_||this==v&&a(_))for(g=l(e),b=n?new this(g):v(g);g>j;j++)P=d?y(e[j],j):e[j],f(b,j,P);else for(O=(w=p(e,_)).next,b=n?new this:[];!(m=i(O,w)).done;j++)P=d?c(w,y,[m.value,j],!0):m.value,f(b,j,P);return b.length=j,b}},1318:(t,e,n)=>{var r=n(5656),o=n(1400),i=n(6244),u=function(t){return function(e,n,u){var c,a=r(e),s=i(a),l=o(u,s);if(t&&n!=n){for(;s>l;)if((c=a[l++])!=c)return!0}else for(;s>l;l++)if((t||l in a)&&a[l]===n)return t||l||0;return!t&&-1}};t.exports={includes:u(!0),indexOf:u(!1)}},2092:(t,e,n)=>{var r=n(9974),o=n(1702),i=n(8361),u=n(7908),c=n(6244),a=n(5417),s=o([].push),l=function(t){var e=1==t,n=2==t,o=3==t,l=4==t,f=6==t,p=7==t,h=5==t||f;return function(v,y,d,g){for(var b,m,w=u(v),O=i(w),P=r(y,d),_=c(O),j=0,x=g||a,R=e?x(v,_):n||p?x(v,0):void 0;_>j;j++)if((h||j in O)&&(m=P(b=O[j],j,w),t))if(e)R[j]=m;else if(m)switch(t){case 3:return!0;case 5:return b;case 6:return j;case 2:s(R,b)}else switch(t){case 4:return!1;case 7:s(R,b)}return f?-1:o||l?l:R}};t.exports={forEach:l(0),map:l(1),filter:l(2),some:l(3),every:l(4),find:l(5),findIndex:l(6),filterReject:l(7)}},1194:(t,e,n)=>{var r=n(7293),o=n(5112),i=n(7392),u=o("species");t.exports=function(t){return i>=51||!r((function(){var e=[];return(e.constructor={})[u]=function(){return{foo:1}},1!==e[t](Boolean).foo}))}},1589:(t,e,n)=>{var r=n(7854),o=n(1400),i=n(6244),u=n(6135),c=r.Array,a=Math.max;t.exports=function(t,e,n){for(var r=i(t),s=o(e,r),l=o(void 0===n?r:n,r),f=c(a(l-s,0)),p=0;s<l;s++,p++)u(f,p,t[s]);return f.length=p,f}},206:(t,e,n)=>{var r=n(1702);t.exports=r([].slice)},7475:(t,e,n)=>{var r=n(7854),o=n(3157),i=n(4411),u=n(111),c=n(5112)("species"),a=r.Array;t.exports=function(t){var e;return o(t)&&(e=t.constructor,(i(e)&&(e===a||o(e.prototype))||u(e)&&null===(e=e[c]))&&(e=void 0)),void 0===e?a:e}},5417:(t,e,n)=>{var r=n(7475);t.exports=function(t,e){return new(r(t))(0===e?0:e)}},3411:(t,e,n)=>{var r=n(9670),o=n(9212);t.exports=function(t,e,n,i){try{return i?e(r(n)[0],n[1]):e(n)}catch(e){o(t,"throw",e)}}},7072:(t,e,n)=>{var r=n(5112)("iterator"),o=!1;try{var i=0,u={next:function(){return{done:!!i++}},return:function(){o=!0}};u[r]=function(){return this},Array.from(u,(function(){throw 2}))}catch(t){}t.exports=function(t,e){if(!e&&!o)return!1;var n=!1;try{var i={};i[r]=function(){return{next:function(){return{done:n=!0}}}},t(i)}catch(t){}return n}},4326:(t,e,n)=>{var r=n(1702),o=r({}.toString),i=r("".slice);t.exports=function(t){return i(o(t),8,-1)}},648:(t,e,n)=>{var r=n(7854),o=n(1694),i=n(614),u=n(4326),c=n(5112)("toStringTag"),a=r.Object,s="Arguments"==u(function(){return arguments}());t.exports=o?u:function(t){var e,n,r;return void 0===t?"Undefined":null===t?"Null":"string"==typeof(n=function(t,e){try{return t[e]}catch(t){}}(e=a(t),c))?n:s?u(e):"Object"==(r=u(e))&&i(e.callee)?"Arguments":r}},5631:(t,e,n)=>{"use strict";var r=n(3070).f,o=n(30),i=n(2248),u=n(9974),c=n(5787),a=n(408),s=n(654),l=n(6340),f=n(9781),p=n(2423).fastKey,h=n(9909),v=h.set,y=h.getterFor;t.exports={getConstructor:function(t,e,n,s){var l=t((function(t,r){c(t,h),v(t,{type:e,index:o(null),first:void 0,last:void 0,size:0}),f||(t.size=0),null!=r&&a(r,t[s],{that:t,AS_ENTRIES:n})})),h=l.prototype,d=y(e),g=function(t,e,n){var r,o,i=d(t),u=b(t,e);return u?u.value=n:(i.last=u={index:o=p(e,!0),key:e,value:n,previous:r=i.last,next:void 0,removed:!1},i.first||(i.first=u),r&&(r.next=u),f?i.size++:t.size++,"F"!==o&&(i.index[o]=u)),t},b=function(t,e){var n,r=d(t),o=p(e);if("F"!==o)return r.index[o];for(n=r.first;n;n=n.next)if(n.key==e)return n};return i(h,{clear:function(){for(var t=d(this),e=t.index,n=t.first;n;)n.removed=!0,n.previous&&(n.previous=n.previous.next=void 0),delete e[n.index],n=n.next;t.first=t.last=void 0,f?t.size=0:this.size=0},delete:function(t){var e=this,n=d(e),r=b(e,t);if(r){var o=r.next,i=r.previous;delete n.index[r.index],r.removed=!0,i&&(i.next=o),o&&(o.previous=i),n.first==r&&(n.first=o),n.last==r&&(n.last=i),f?n.size--:e.size--}return!!r},forEach:function(t){for(var e,n=d(this),r=u(t,arguments.length>1?arguments[1]:void 0);e=e?e.next:n.first;)for(r(e.value,e.key,this);e&&e.removed;)e=e.previous},has:function(t){return!!b(this,t)}}),i(h,n?{get:function(t){var e=b(this,t);return e&&e.value},set:function(t,e){return g(this,0===t?0:t,e)}}:{add:function(t){return g(this,t=0===t?0:t,t)}}),f&&r(h,"size",{get:function(){return d(this).size}}),l},setStrong:function(t,e,n){var r=e+" Iterator",o=y(e),i=y(r);s(t,e,(function(t,e){v(this,{type:r,target:t,state:o(t),kind:e,last:void 0})}),(function(){for(var t=i(this),e=t.kind,n=t.last;n&&n.removed;)n=n.previous;return t.target&&(t.last=n=n?n.next:t.state.first)?"keys"==e?{value:n.key,done:!1}:"values"==e?{value:n.value,done:!1}:{value:[n.key,n.value],done:!1}:(t.target=void 0,{value:void 0,done:!0})}),n?"entries":"values",!n,!0),l(e)}}},7710:(t,e,n)=>{"use strict";var r=n(2109),o=n(7854),i=n(1702),u=n(4705),c=n(1320),a=n(2423),s=n(408),l=n(5787),f=n(614),p=n(111),h=n(7293),v=n(7072),y=n(8003),d=n(9587);t.exports=function(t,e,n){var g=-1!==t.indexOf("Map"),b=-1!==t.indexOf("Weak"),m=g?"set":"add",w=o[t],O=w&&w.prototype,P=w,_={},j=function(t){var e=i(O[t]);c(O,t,"add"==t?function(t){return e(this,0===t?0:t),this}:"delete"==t?function(t){return!(b&&!p(t))&&e(this,0===t?0:t)}:"get"==t?function(t){return b&&!p(t)?void 0:e(this,0===t?0:t)}:"has"==t?function(t){return!(b&&!p(t))&&e(this,0===t?0:t)}:function(t,n){return e(this,0===t?0:t,n),this})};if(u(t,!f(w)||!(b||O.forEach&&!h((function(){(new w).entries().next()})))))P=n.getConstructor(e,t,g,m),a.enable();else if(u(t,!0)){var x=new P,R=x[m](b?{}:-0,1)!=x,S=h((function(){x.has(1)})),k=v((function(t){new w(t)})),E=!b&&h((function(){for(var t=new w,e=5;e--;)t[m](e,e);return!t.has(-0)}));k||((P=e((function(t,e){l(t,O);var n=d(new w,t,P);return null!=e&&s(e,n[m],{that:n,AS_ENTRIES:g}),n}))).prototype=O,O.constructor=P),(S||E)&&(j("delete"),j("has"),g&&j("get")),(E||R)&&j(m),b&&O.clear&&delete O.clear}return _[t]=P,r({global:!0,forced:P!=w},_),y(P,t),b||n.setStrong(P,t,g),P}},9920:(t,e,n)=>{var r=n(2597),o=n(3887),i=n(1236),u=n(3070);t.exports=function(t,e,n){for(var c=o(e),a=u.f,s=i.f,l=0;l<c.length;l++){var f=c[l];r(t,f)||n&&r(n,f)||a(t,f,s(e,f))}}},8544:(t,e,n)=>{var r=n(7293);t.exports=!r((function(){function t(){}return t.prototype.constructor=null,Object.getPrototypeOf(new t)!==t.prototype}))},4994:(t,e,n)=>{"use strict";var r=n(3383).IteratorPrototype,o=n(30),i=n(9114),u=n(8003),c=n(7497),a=function(){return this};t.exports=function(t,e,n,s){var l=e+" Iterator";return t.prototype=o(r,{next:i(+!s,n)}),u(t,l,!1,!0),c[l]=a,t}},8880:(t,e,n)=>{var r=n(9781),o=n(3070),i=n(9114);t.exports=r?function(t,e,n){return o.f(t,e,i(1,n))}:function(t,e,n){return t[e]=n,t}},9114:t=>{t.exports=function(t,e){return{enumerable:!(1&t),configurable:!(2&t),writable:!(4&t),value:e}}},6135:(t,e,n)=>{"use strict";var r=n(4948),o=n(3070),i=n(9114);t.exports=function(t,e,n){var u=r(e);u in t?o.f(t,u,i(0,n)):t[u]=n}},654:(t,e,n)=>{"use strict";var r=n(2109),o=n(6916),i=n(1913),u=n(6530),c=n(614),a=n(4994),s=n(9518),l=n(7674),f=n(8003),p=n(8880),h=n(1320),v=n(5112),y=n(7497),d=n(3383),g=u.PROPER,b=u.CONFIGURABLE,m=d.IteratorPrototype,w=d.BUGGY_SAFARI_ITERATORS,O=v("iterator"),P="keys",_="values",j="entries",x=function(){return this};t.exports=function(t,e,n,u,v,d,R){a(n,e,u);var S,k,E,T=function(t){if(t===v&&F)return F;if(!w&&t in U)return U[t];switch(t){case P:case _:case j:return function(){return new n(this,t)}}return function(){return new n(this)}},C=e+" Iterator",I=!1,U=t.prototype,A=U[O]||U["@@iterator"]||v&&U[v],F=!w&&A||T(v),L="Array"==e&&U.entries||A;if(L&&(S=s(L.call(new t)))!==Object.prototype&&S.next&&(i||s(S)===m||(l?l(S,m):c(S[O])||h(S,O,x)),f(S,C,!0,!0),i&&(y[C]=x)),g&&v==_&&A&&A.name!==_&&(!i&&b?p(U,"name",_):(I=!0,F=function(){return o(A,this)})),v)if(k={values:T(_),keys:d?F:T(P),entries:T(j)},R)for(E in k)(w||I||!(E in U))&&h(U,E,k[E]);else r({target:e,proto:!0,forced:w||I},k);return i&&!R||U[O]===F||h(U,O,F,{name:v}),y[e]=F,k}},7235:(t,e,n)=>{var r=n(857),o=n(2597),i=n(6061),u=n(3070).f;t.exports=function(t){var e=r.Symbol||(r.Symbol={});o(e,t)||u(e,t,{value:i.f(t)})}},9781:(t,e,n)=>{var r=n(7293);t.exports=!r((function(){return 7!=Object.defineProperty({},1,{get:function(){return 7}})[1]}))},317:(t,e,n)=>{var r=n(7854),o=n(111),i=r.document,u=o(i)&&o(i.createElement);t.exports=function(t){return u?i.createElement(t):{}}},8324:t=>{t.exports={CSSRuleList:0,CSSStyleDeclaration:0,CSSValueList:0,ClientRectList:0,DOMRectList:0,DOMStringList:0,DOMTokenList:1,DataTransferItemList:0,FileList:0,HTMLAllCollection:0,HTMLCollection:0,HTMLFormElement:0,HTMLSelectElement:0,MediaList:0,MimeTypeArray:0,NamedNodeMap:0,NodeList:1,PaintRequestList:0,Plugin:0,PluginArray:0,SVGLengthList:0,SVGNumberList:0,SVGPathSegList:0,SVGPointList:0,SVGStringList:0,SVGTransformList:0,SourceBufferList:0,StyleSheetList:0,TextTrackCueList:0,TextTrackList:0,TouchList:0}},8509:(t,e,n)=>{var r=n(317)("span").classList,o=r&&r.constructor&&r.constructor.prototype;t.exports=o===Object.prototype?void 0:o},7871:t=>{t.exports="object"==typeof window},1528:(t,e,n)=>{var r=n(8113),o=n(7854);t.exports=/ipad|iphone|ipod/i.test(r)&&void 0!==o.Pebble},6833:(t,e,n)=>{var r=n(8113);t.exports=/(?:ipad|iphone|ipod).*applewebkit/i.test(r)},5268:(t,e,n)=>{var r=n(4326),o=n(7854);t.exports="process"==r(o.process)},1036:(t,e,n)=>{var r=n(8113);t.exports=/web0s(?!.*chrome)/i.test(r)},8113:(t,e,n)=>{var r=n(5005);t.exports=r("navigator","userAgent")||""},7392:(t,e,n)=>{var r,o,i=n(7854),u=n(8113),c=i.process,a=i.Deno,s=c&&c.versions||a&&a.version,l=s&&s.v8;l&&(o=(r=l.split("."))[0]>0&&r[0]<4?1:+(r[0]+r[1])),!o&&u&&(!(r=u.match(/Edge\/(\d+)/))||r[1]>=74)&&(r=u.match(/Chrome\/(\d+)/))&&(o=+r[1]),t.exports=o},748:t=>{t.exports=["constructor","hasOwnProperty","isPrototypeOf","propertyIsEnumerable","toLocaleString","toString","valueOf"]},2109:(t,e,n)=>{var r=n(7854),o=n(1236).f,i=n(8880),u=n(1320),c=n(3505),a=n(9920),s=n(4705);t.exports=function(t,e){var n,l,f,p,h,v=t.target,y=t.global,d=t.stat;if(n=y?r:d?r[v]||c(v,{}):(r[v]||{}).prototype)for(l in e){if(p=e[l],f=t.noTargetGet?(h=o(n,l))&&h.value:n[l],!s(y?l:v+(d?".":"#")+l,t.forced)&&void 0!==f){if(typeof p==typeof f)continue;a(p,f)}(t.sham||f&&f.sham)&&i(p,"sham",!0),u(n,l,p,t)}}},7293:t=>{t.exports=function(t){try{return!!t()}catch(t){return!0}}},6677:(t,e,n)=>{var r=n(7293);t.exports=!r((function(){return Object.isExtensible(Object.preventExtensions({}))}))},2104:(t,e,n)=>{var r=n(4374),o=Function.prototype,i=o.apply,u=o.call;t.exports="object"==typeof Reflect&&Reflect.apply||(r?u.bind(i):function(){return u.apply(i,arguments)})},9974:(t,e,n)=>{var r=n(1702),o=n(9662),i=n(4374),u=r(r.bind);t.exports=function(t,e){return o(t),void 0===e?t:i?u(t,e):function(){return t.apply(e,arguments)}}},4374:(t,e,n)=>{var r=n(7293);t.exports=!r((function(){var t=function(){}.bind();return"function"!=typeof t||t.hasOwnProperty("prototype")}))},7065:(t,e,n)=>{"use strict";var r=n(7854),o=n(1702),i=n(9662),u=n(111),c=n(2597),a=n(206),s=n(4374),l=r.Function,f=o([].concat),p=o([].join),h={},v=function(t,e,n){if(!c(h,e)){for(var r=[],o=0;o<e;o++)r[o]="a["+o+"]";h[e]=l("C,a","return new C("+p(r,",")+")")}return h[e](t,n)};t.exports=s?l.bind:function(t){var e=i(this),n=e.prototype,r=a(arguments,1),o=function(){var n=f(r,a(arguments));return this instanceof o?v(e,n.length,n):e.apply(t,n)};return u(n)&&(o.prototype=n),o}},6916:(t,e,n)=>{var r=n(4374),o=Function.prototype.call;t.exports=r?o.bind(o):function(){return o.apply(o,arguments)}},6530:(t,e,n)=>{var r=n(9781),o=n(2597),i=Function.prototype,u=r&&Object.getOwnPropertyDescriptor,c=o(i,"name"),a=c&&"something"===function(){}.name,s=c&&(!r||r&&u(i,"name").configurable);t.exports={EXISTS:c,PROPER:a,CONFIGURABLE:s}},1702:(t,e,n)=>{var r=n(4374),o=Function.prototype,i=o.bind,u=o.call,c=r&&i.bind(u,u);t.exports=r?function(t){return t&&c(t)}:function(t){return t&&function(){return u.apply(t,arguments)}}},5005:(t,e,n)=>{var r=n(7854),o=n(614),i=function(t){return o(t)?t:void 0};t.exports=function(t,e){return arguments.length<2?i(r[t]):r[t]&&r[t][e]}},1246:(t,e,n)=>{var r=n(648),o=n(8173),i=n(7497),u=n(5112)("iterator");t.exports=function(t){if(null!=t)return o(t,u)||o(t,"@@iterator")||i[r(t)]}},8554:(t,e,n)=>{var r=n(7854),o=n(6916),i=n(9662),u=n(9670),c=n(6330),a=n(1246),s=r.TypeError;t.exports=function(t,e){var n=arguments.length<2?a(t):e;if(i(n))return u(o(n,t));throw s(c(t)+" is not iterable")}},8173:(t,e,n)=>{var r=n(9662);t.exports=function(t,e){var n=t[e];return null==n?void 0:r(n)}},7854:(t,e,n)=>{var r=function(t){return t&&t.Math==Math&&t};t.exports=r("object"==typeof globalThis&&globalThis)||r("object"==typeof window&&window)||r("object"==typeof self&&self)||r("object"==typeof n.g&&n.g)||function(){return this}()||Function("return this")()},2597:(t,e,n)=>{var r=n(1702),o=n(7908),i=r({}.hasOwnProperty);t.exports=Object.hasOwn||function(t,e){return i(o(t),e)}},3501:t=>{t.exports={}},842:(t,e,n)=>{var r=n(7854);t.exports=function(t,e){var n=r.console;n&&n.error&&(1==arguments.length?n.error(t):n.error(t,e))}},490:(t,e,n)=>{var r=n(5005);t.exports=r("document","documentElement")},4664:(t,e,n)=>{var r=n(9781),o=n(7293),i=n(317);t.exports=!r&&!o((function(){return 7!=Object.defineProperty(i("div"),"a",{get:function(){return 7}}).a}))},8361:(t,e,n)=>{var r=n(7854),o=n(1702),i=n(7293),u=n(4326),c=r.Object,a=o("".split);t.exports=i((function(){return!c("z").propertyIsEnumerable(0)}))?function(t){return"String"==u(t)?a(t,""):c(t)}:c},9587:(t,e,n)=>{var r=n(614),o=n(111),i=n(7674);t.exports=function(t,e,n){var u,c;return i&&r(u=e.constructor)&&u!==n&&o(c=u.prototype)&&c!==n.prototype&&i(t,c),t}},2788:(t,e,n)=>{var r=n(1702),o=n(614),i=n(5465),u=r(Function.toString);o(i.inspectSource)||(i.inspectSource=function(t){return u(t)}),t.exports=i.inspectSource},2423:(t,e,n)=>{var r=n(2109),o=n(1702),i=n(3501),u=n(111),c=n(2597),a=n(3070).f,s=n(8006),l=n(1156),f=n(2050),p=n(9711),h=n(6677),v=!1,y=p("meta"),d=0,g=function(t){a(t,y,{value:{objectID:"O"+d++,weakData:{}}})},b=t.exports={enable:function(){b.enable=function(){},v=!0;var t=s.f,e=o([].splice),n={};n[y]=1,t(n).length&&(s.f=function(n){for(var r=t(n),o=0,i=r.length;o<i;o++)if(r[o]===y){e(r,o,1);break}return r},r({target:"Object",stat:!0,forced:!0},{getOwnPropertyNames:l.f}))},fastKey:function(t,e){if(!u(t))return"symbol"==typeof t?t:("string"==typeof t?"S":"P")+t;if(!c(t,y)){if(!f(t))return"F";if(!e)return"E";g(t)}return t[y].objectID},getWeakData:function(t,e){if(!c(t,y)){if(!f(t))return!0;if(!e)return!1;g(t)}return t[y].weakData},onFreeze:function(t){return h&&v&&f(t)&&!c(t,y)&&g(t),t}};i[y]=!0},9909:(t,e,n)=>{var r,o,i,u=n(8536),c=n(7854),a=n(1702),s=n(111),l=n(8880),f=n(2597),p=n(5465),h=n(6200),v=n(3501),y="Object already initialized",d=c.TypeError,g=c.WeakMap;if(u||p.state){var b=p.state||(p.state=new g),m=a(b.get),w=a(b.has),O=a(b.set);r=function(t,e){if(w(b,t))throw new d(y);return e.facade=t,O(b,t,e),e},o=function(t){return m(b,t)||{}},i=function(t){return w(b,t)}}else{var P=h("state");v[P]=!0,r=function(t,e){if(f(t,P))throw new d(y);return e.facade=t,l(t,P,e),e},o=function(t){return f(t,P)?t[P]:{}},i=function(t){return f(t,P)}}t.exports={set:r,get:o,has:i,enforce:function(t){return i(t)?o(t):r(t,{})},getterFor:function(t){return function(e){var n;if(!s(e)||(n=o(e)).type!==t)throw d("Incompatible receiver, "+t+" required");return n}}}},7659:(t,e,n)=>{var r=n(5112),o=n(7497),i=r("iterator"),u=Array.prototype;t.exports=function(t){return void 0!==t&&(o.Array===t||u[i]===t)}},3157:(t,e,n)=>{var r=n(4326);t.exports=Array.isArray||function(t){return"Array"==r(t)}},614:t=>{t.exports=function(t){return"function"==typeof t}},4411:(t,e,n)=>{var r=n(1702),o=n(7293),i=n(614),u=n(648),c=n(5005),a=n(2788),s=function(){},l=[],f=c("Reflect","construct"),p=/^\s*(?:class|function)\b/,h=r(p.exec),v=!p.exec(s),y=function(t){if(!i(t))return!1;try{return f(s,l,t),!0}catch(t){return!1}},d=function(t){if(!i(t))return!1;switch(u(t)){case"AsyncFunction":case"GeneratorFunction":case"AsyncGeneratorFunction":return!1}try{return v||!!h(p,a(t))}catch(t){return!0}};d.sham=!0,t.exports=!f||o((function(){var t;return y(y.call)||!y(Object)||!y((function(){t=!0}))||t}))?d:y},4705:(t,e,n)=>{var r=n(7293),o=n(614),i=/#|\.prototype\./,u=function(t,e){var n=a[c(t)];return n==l||n!=s&&(o(e)?r(e):!!e)},c=u.normalize=function(t){return String(t).replace(i,".").toLowerCase()},a=u.data={},s=u.NATIVE="N",l=u.POLYFILL="P";t.exports=u},111:(t,e,n)=>{var r=n(614);t.exports=function(t){return"object"==typeof t?null!==t:r(t)}},1913:t=>{t.exports=!1},2190:(t,e,n)=>{var r=n(7854),o=n(5005),i=n(614),u=n(7976),c=n(3307),a=r.Object;t.exports=c?function(t){return"symbol"==typeof t}:function(t){var e=o("Symbol");return i(e)&&u(e.prototype,a(t))}},408:(t,e,n)=>{var r=n(7854),o=n(9974),i=n(6916),u=n(9670),c=n(6330),a=n(7659),s=n(6244),l=n(7976),f=n(8554),p=n(1246),h=n(9212),v=r.TypeError,y=function(t,e){this.stopped=t,this.result=e},d=y.prototype;t.exports=function(t,e,n){var r,g,b,m,w,O,P,_=n&&n.that,j=!(!n||!n.AS_ENTRIES),x=!(!n||!n.IS_ITERATOR),R=!(!n||!n.INTERRUPTED),S=o(e,_),k=function(t){return r&&h(r,"normal",t),new y(!0,t)},E=function(t){return j?(u(t),R?S(t[0],t[1],k):S(t[0],t[1])):R?S(t,k):S(t)};if(x)r=t;else{if(!(g=p(t)))throw v(c(t)+" is not iterable");if(a(g)){for(b=0,m=s(t);m>b;b++)if((w=E(t[b]))&&l(d,w))return w;return new y(!1)}r=f(t,g)}for(O=r.next;!(P=i(O,r)).done;){try{w=E(P.value)}catch(t){h(r,"throw",t)}if("object"==typeof w&&w&&l(d,w))return w}return new y(!1)}},9212:(t,e,n)=>{var r=n(6916),o=n(9670),i=n(8173);t.exports=function(t,e,n){var u,c;o(t);try{if(!(u=i(t,"return"))){if("throw"===e)throw n;return n}u=r(u,t)}catch(t){c=!0,u=t}if("throw"===e)throw n;if(c)throw u;return o(u),n}},3383:(t,e,n)=>{"use strict";var r,o,i,u=n(7293),c=n(614),a=n(30),s=n(9518),l=n(1320),f=n(5112),p=n(1913),h=f("iterator"),v=!1;[].keys&&("next"in(i=[].keys())?(o=s(s(i)))!==Object.prototype&&(r=o):v=!0),null==r||u((function(){var t={};return r[h].call(t)!==t}))?r={}:p&&(r=a(r)),c(r[h])||l(r,h,(function(){return this})),t.exports={IteratorPrototype:r,BUGGY_SAFARI_ITERATORS:v}},7497:t=>{t.exports={}},6244:(t,e,n)=>{var r=n(7466);t.exports=function(t){return r(t.length)}},5948:(t,e,n)=>{var r,o,i,u,c,a,s,l,f=n(7854),p=n(9974),h=n(1236).f,v=n(261).set,y=n(6833),d=n(1528),g=n(1036),b=n(5268),m=f.MutationObserver||f.WebKitMutationObserver,w=f.document,O=f.process,P=f.Promise,_=h(f,"queueMicrotask"),j=_&&_.value;j||(r=function(){var t,e;for(b&&(t=O.domain)&&t.exit();o;){e=o.fn,o=o.next;try{e()}catch(t){throw o?u():i=void 0,t}}i=void 0,t&&t.enter()},y||b||g||!m||!w?!d&&P&&P.resolve?((s=P.resolve(void 0)).constructor=P,l=p(s.then,s),u=function(){l(r)}):b?u=function(){O.nextTick(r)}:(v=p(v,f),u=function(){v(r)}):(c=!0,a=w.createTextNode(""),new m(r).observe(a,{characterData:!0}),u=function(){a.data=c=!c})),t.exports=j||function(t){var e={fn:t,next:void 0};i&&(i.next=e),o||(o=e,u()),i=e}},3366:(t,e,n)=>{var r=n(7854);t.exports=r.Promise},133:(t,e,n)=>{var r=n(7392),o=n(7293);t.exports=!!Object.getOwnPropertySymbols&&!o((function(){var t=Symbol();return!String(t)||!(Object(t)instanceof Symbol)||!Symbol.sham&&r&&r<41}))},8536:(t,e,n)=>{var r=n(7854),o=n(614),i=n(2788),u=r.WeakMap;t.exports=o(u)&&/native code/.test(i(u))},8523:(t,e,n)=>{"use strict";var r=n(9662),o=function(t){var e,n;this.promise=new t((function(t,r){if(void 0!==e||void 0!==n)throw TypeError("Bad Promise constructor");e=t,n=r})),this.resolve=r(e),this.reject=r(n)};t.exports.f=function(t){return new o(t)}},30:(t,e,n)=>{var r,o=n(9670),i=n(6048),u=n(748),c=n(3501),a=n(490),s=n(317),l=n(6200)("IE_PROTO"),f=function(){},p=function(t){return"<script>"+t+"<\/script>"},h=function(t){t.write(p("")),t.close();var e=t.parentWindow.Object;return t=null,e},v=function(){try{r=new ActiveXObject("htmlfile")}catch(t){}var t,e;v="undefined"!=typeof document?document.domain&&r?h(r):((e=s("iframe")).style.display="none",a.appendChild(e),e.src=String("javascript:"),(t=e.contentWindow.document).open(),t.write(p("document.F=Object")),t.close(),t.F):h(r);for(var n=u.length;n--;)delete v.prototype[u[n]];return v()};c[l]=!0,t.exports=Object.create||function(t,e){var n;return null!==t?(f.prototype=o(t),n=new f,f.prototype=null,n[l]=t):n=v(),void 0===e?n:i.f(n,e)}},6048:(t,e,n)=>{var r=n(9781),o=n(3353),i=n(3070),u=n(9670),c=n(5656),a=n(1956);e.f=r&&!o?Object.defineProperties:function(t,e){u(t);for(var n,r=c(e),o=a(e),s=o.length,l=0;s>l;)i.f(t,n=o[l++],r[n]);return t}},3070:(t,e,n)=>{var r=n(7854),o=n(9781),i=n(4664),u=n(3353),c=n(9670),a=n(4948),s=r.TypeError,l=Object.defineProperty,f=Object.getOwnPropertyDescriptor;e.f=o?u?function(t,e,n){if(c(t),e=a(e),c(n),"function"==typeof t&&"prototype"===e&&"value"in n&&"writable"in n&&!n.writable){var r=f(t,e);r&&r.writable&&(t[e]=n.value,n={configurable:"configurable"in n?n.configurable:r.configurable,enumerable:"enumerable"in n?n.enumerable:r.enumerable,writable:!1})}return l(t,e,n)}:l:function(t,e,n){if(c(t),e=a(e),c(n),i)try{return l(t,e,n)}catch(t){}if("get"in n||"set"in n)throw s("Accessors not supported");return"value"in n&&(t[e]=n.value),t}},1236:(t,e,n)=>{var r=n(9781),o=n(6916),i=n(5296),u=n(9114),c=n(5656),a=n(4948),s=n(2597),l=n(4664),f=Object.getOwnPropertyDescriptor;e.f=r?f:function(t,e){if(t=c(t),e=a(e),l)try{return f(t,e)}catch(t){}if(s(t,e))return u(!o(i.f,t,e),t[e])}},1156:(t,e,n)=>{var r=n(4326),o=n(5656),i=n(8006).f,u=n(1589),c="object"==typeof window&&window&&Object.getOwnPropertyNames?Object.getOwnPropertyNames(window):[];t.exports.f=function(t){return c&&"Window"==r(t)?function(t){try{return i(t)}catch(t){return u(c)}}(t):i(o(t))}},8006:(t,e,n)=>{var r=n(6324),o=n(748).concat("length","prototype");e.f=Object.getOwnPropertyNames||function(t){return r(t,o)}},5181:(t,e)=>{e.f=Object.getOwnPropertySymbols},9518:(t,e,n)=>{var r=n(7854),o=n(2597),i=n(614),u=n(7908),c=n(6200),a=n(8544),s=c("IE_PROTO"),l=r.Object,f=l.prototype;t.exports=a?l.getPrototypeOf:function(t){var e=u(t);if(o(e,s))return e[s];var n=e.constructor;return i(n)&&e instanceof n?n.prototype:e instanceof l?f:null}},2050:(t,e,n)=>{var r=n(7293),o=n(111),i=n(4326),u=n(7556),c=Object.isExtensible,a=r((function(){c(1)}));t.exports=a||u?function(t){return!!o(t)&&(!u||"ArrayBuffer"!=i(t))&&(!c||c(t))}:c},7976:(t,e,n)=>{var r=n(1702);t.exports=r({}.isPrototypeOf)},6324:(t,e,n)=>{var r=n(1702),o=n(2597),i=n(5656),u=n(1318).indexOf,c=n(3501),a=r([].push);t.exports=function(t,e){var n,r=i(t),s=0,l=[];for(n in r)!o(c,n)&&o(r,n)&&a(l,n);for(;e.length>s;)o(r,n=e[s++])&&(~u(l,n)||a(l,n));return l}},1956:(t,e,n)=>{var r=n(6324),o=n(748);t.exports=Object.keys||function(t){return r(t,o)}},5296:(t,e)=>{"use strict";var n={}.propertyIsEnumerable,r=Object.getOwnPropertyDescriptor,o=r&&!n.call({1:2},1);e.f=o?function(t){var e=r(this,t);return!!e&&e.enumerable}:n},7674:(t,e,n)=>{var r=n(1702),o=n(9670),i=n(6077);t.exports=Object.setPrototypeOf||("__proto__"in{}?function(){var t,e=!1,n={};try{(t=r(Object.getOwnPropertyDescriptor(Object.prototype,"__proto__").set))(n,[]),e=n instanceof Array}catch(t){}return function(n,r){return o(n),i(r),e?t(n,r):n.__proto__=r,n}}():void 0)},288:(t,e,n)=>{"use strict";var r=n(1694),o=n(648);t.exports=r?{}.toString:function(){return"[object "+o(this)+"]"}},2140:(t,e,n)=>{var r=n(7854),o=n(6916),i=n(614),u=n(111),c=r.TypeError;t.exports=function(t,e){var n,r;if("string"===e&&i(n=t.toString)&&!u(r=o(n,t)))return r;if(i(n=t.valueOf)&&!u(r=o(n,t)))return r;if("string"!==e&&i(n=t.toString)&&!u(r=o(n,t)))return r;throw c("Can't convert object to primitive value")}},3887:(t,e,n)=>{var r=n(5005),o=n(1702),i=n(8006),u=n(5181),c=n(9670),a=o([].concat);t.exports=r("Reflect","ownKeys")||function(t){var e=i.f(c(t)),n=u.f;return n?a(e,n(t)):e}},857:(t,e,n)=>{var r=n(7854);t.exports=r},2534:t=>{t.exports=function(t){try{return{error:!1,value:t()}}catch(t){return{error:!0,value:t}}}},9478:(t,e,n)=>{var r=n(9670),o=n(111),i=n(8523);t.exports=function(t,e){if(r(t),o(e)&&e.constructor===t)return e;var n=i.f(t);return(0,n.resolve)(e),n.promise}},8572:t=>{var e=function(){this.head=null,this.tail=null};e.prototype={add:function(t){var e={item:t,next:null};this.head?this.tail.next=e:this.head=e,this.tail=e},get:function(){var t=this.head;if(t)return this.head=t.next,this.tail===t&&(this.tail=null),t.item}},t.exports=e},2248:(t,e,n)=>{var r=n(1320);t.exports=function(t,e,n){for(var o in e)r(t,o,e[o],n);return t}},1320:(t,e,n)=>{var r=n(7854),o=n(614),i=n(2597),u=n(8880),c=n(3505),a=n(2788),s=n(9909),l=n(6530).CONFIGURABLE,f=s.get,p=s.enforce,h=String(String).split("String");(t.exports=function(t,e,n,a){var s,f=!!a&&!!a.unsafe,v=!!a&&!!a.enumerable,y=!!a&&!!a.noTargetGet,d=a&&void 0!==a.name?a.name:e;o(n)&&("Symbol("===String(d).slice(0,7)&&(d="["+String(d).replace(/^Symbol\(([^)]*)\)/,"$1")+"]"),(!i(n,"name")||l&&n.name!==d)&&u(n,"name",d),(s=p(n)).source||(s.source=h.join("string"==typeof d?d:""))),t!==r?(f?!y&&t[e]&&(v=!0):delete t[e],v?t[e]=n:u(t,e,n)):v?t[e]=n:c(e,n)})(Function.prototype,"toString",(function(){return o(this)&&f(this).source||a(this)}))},2261:(t,e,n)=>{"use strict";var r,o,i=n(6916),u=n(1702),c=n(1340),a=n(7066),s=n(2999),l=n(2309),f=n(30),p=n(9909).get,h=n(9441),v=n(7168),y=l("native-string-replace",String.prototype.replace),d=RegExp.prototype.exec,g=d,b=u("".charAt),m=u("".indexOf),w=u("".replace),O=u("".slice),P=(o=/b*/g,i(d,r=/a/,"a"),i(d,o,"a"),0!==r.lastIndex||0!==o.lastIndex),_=s.BROKEN_CARET,j=void 0!==/()??/.exec("")[1];(P||j||_||h||v)&&(g=function(t){var e,n,r,o,u,s,l,h=this,v=p(h),x=c(t),R=v.raw;if(R)return R.lastIndex=h.lastIndex,e=i(g,R,x),h.lastIndex=R.lastIndex,e;var S=v.groups,k=_&&h.sticky,E=i(a,h),T=h.source,C=0,I=x;if(k&&(E=w(E,"y",""),-1===m(E,"g")&&(E+="g"),I=O(x,h.lastIndex),h.lastIndex>0&&(!h.multiline||h.multiline&&"\n"!==b(x,h.lastIndex-1))&&(T="(?: "+T+")",I=" "+I,C++),n=new RegExp("^(?:"+T+")",E)),j&&(n=new RegExp("^"+T+"$(?!\\s)",E)),P&&(r=h.lastIndex),o=i(d,k?n:h,I),k?o?(o.input=O(o.input,C),o[0]=O(o[0],C),o.index=h.lastIndex,h.lastIndex+=o[0].length):h.lastIndex=0:P&&o&&(h.lastIndex=h.global?o.index+o[0].length:r),j&&o&&o.length>1&&i(y,o[0],n,(function(){for(u=1;u<arguments.length-2;u++)void 0===arguments[u]&&(o[u]=void 0)})),o&&S)for(o.groups=s=f(null),u=0;u<S.length;u++)s[(l=S[u])[0]]=o[l[1]];return o}),t.exports=g},7066:(t,e,n)=>{"use strict";var r=n(9670);t.exports=function(){var t=r(this),e="";return t.global&&(e+="g"),t.ignoreCase&&(e+="i"),t.multiline&&(e+="m"),t.dotAll&&(e+="s"),t.unicode&&(e+="u"),t.sticky&&(e+="y"),e}},2999:(t,e,n)=>{var r=n(7293),o=n(7854).RegExp,i=r((function(){var t=o("a","y");return t.lastIndex=2,null!=t.exec("abcd")})),u=i||r((function(){return!o("a","y").sticky})),c=i||r((function(){var t=o("^r","gy");return t.lastIndex=2,null!=t.exec("str")}));t.exports={BROKEN_CARET:c,MISSED_STICKY:u,UNSUPPORTED_Y:i}},9441:(t,e,n)=>{var r=n(7293),o=n(7854).RegExp;t.exports=r((function(){var t=o(".","s");return!(t.dotAll&&t.exec("\n")&&"s"===t.flags)}))},7168:(t,e,n)=>{var r=n(7293),o=n(7854).RegExp;t.exports=r((function(){var t=o("(?<a>b)","g");return"b"!==t.exec("b").groups.a||"bc"!=="b".replace(t,"$<a>c")}))},4488:(t,e,n)=>{var r=n(7854).TypeError;t.exports=function(t){if(null==t)throw r("Can't call method on "+t);return t}},3505:(t,e,n)=>{var r=n(7854),o=Object.defineProperty;t.exports=function(t,e){try{o(r,t,{value:e,configurable:!0,writable:!0})}catch(n){r[t]=e}return e}},6340:(t,e,n)=>{"use strict";var r=n(5005),o=n(3070),i=n(5112),u=n(9781),c=i("species");t.exports=function(t){var e=r(t),n=o.f;u&&e&&!e[c]&&n(e,c,{configurable:!0,get:function(){return this}})}},8003:(t,e,n)=>{var r=n(3070).f,o=n(2597),i=n(5112)("toStringTag");t.exports=function(t,e,n){t&&!n&&(t=t.prototype),t&&!o(t,i)&&r(t,i,{configurable:!0,value:e})}},6200:(t,e,n)=>{var r=n(2309),o=n(9711),i=r("keys");t.exports=function(t){return i[t]||(i[t]=o(t))}},5465:(t,e,n)=>{var r=n(7854),o=n(3505),i="__core-js_shared__",u=r[i]||o(i,{});t.exports=u},2309:(t,e,n)=>{var r=n(1913),o=n(5465);(t.exports=function(t,e){return o[t]||(o[t]=void 0!==e?e:{})})("versions",[]).push({version:"3.21.1",mode:r?"pure":"global",copyright:"© 2014-2022 Denis Pushkarev (zloirock.ru)",license:"https://github.com/zloirock/core-js/blob/v3.21.1/LICENSE",source:"https://github.com/zloirock/core-js"})},6707:(t,e,n)=>{var r=n(9670),o=n(9483),i=n(5112)("species");t.exports=function(t,e){var n,u=r(t).constructor;return void 0===u||null==(n=r(u)[i])?e:o(n)}},8710:(t,e,n)=>{var r=n(1702),o=n(9303),i=n(1340),u=n(4488),c=r("".charAt),a=r("".charCodeAt),s=r("".slice),l=function(t){return function(e,n){var r,l,f=i(u(e)),p=o(n),h=f.length;return p<0||p>=h?t?"":void 0:(r=a(f,p))<55296||r>56319||p+1===h||(l=a(f,p+1))<56320||l>57343?t?c(f,p):r:t?s(f,p,p+2):l-56320+(r-55296<<10)+65536}};t.exports={codeAt:l(!1),charAt:l(!0)}},261:(t,e,n)=>{var r,o,i,u,c=n(7854),a=n(2104),s=n(9974),l=n(614),f=n(2597),p=n(7293),h=n(490),v=n(206),y=n(317),d=n(8053),g=n(6833),b=n(5268),m=c.setImmediate,w=c.clearImmediate,O=c.process,P=c.Dispatch,_=c.Function,j=c.MessageChannel,x=c.String,R=0,S={};try{r=c.location}catch(t){}var k=function(t){if(f(S,t)){var e=S[t];delete S[t],e()}},E=function(t){return function(){k(t)}},T=function(t){k(t.data)},C=function(t){c.postMessage(x(t),r.protocol+"//"+r.host)};m&&w||(m=function(t){d(arguments.length,1);var e=l(t)?t:_(t),n=v(arguments,1);return S[++R]=function(){a(e,void 0,n)},o(R),R},w=function(t){delete S[t]},b?o=function(t){O.nextTick(E(t))}:P&&P.now?o=function(t){P.now(E(t))}:j&&!g?(u=(i=new j).port2,i.port1.onmessage=T,o=s(u.postMessage,u)):c.addEventListener&&l(c.postMessage)&&!c.importScripts&&r&&"file:"!==r.protocol&&!p(C)?(o=C,c.addEventListener("message",T,!1)):o="onreadystatechange"in y("script")?function(t){h.appendChild(y("script")).onreadystatechange=function(){h.removeChild(this),k(t)}}:function(t){setTimeout(E(t),0)}),t.exports={set:m,clear:w}},1400:(t,e,n)=>{var r=n(9303),o=Math.max,i=Math.min;t.exports=function(t,e){var n=r(t);return n<0?o(n+e,0):i(n,e)}},5656:(t,e,n)=>{var r=n(8361),o=n(4488);t.exports=function(t){return r(o(t))}},9303:t=>{var e=Math.ceil,n=Math.floor;t.exports=function(t){var r=+t;return r!=r||0===r?0:(r>0?n:e)(r)}},7466:(t,e,n)=>{var r=n(9303),o=Math.min;t.exports=function(t){return t>0?o(r(t),9007199254740991):0}},7908:(t,e,n)=>{var r=n(7854),o=n(4488),i=r.Object;t.exports=function(t){return i(o(t))}},7593:(t,e,n)=>{var r=n(7854),o=n(6916),i=n(111),u=n(2190),c=n(8173),a=n(2140),s=n(5112),l=r.TypeError,f=s("toPrimitive");t.exports=function(t,e){if(!i(t)||u(t))return t;var n,r=c(t,f);if(r){if(void 0===e&&(e="default"),n=o(r,t,e),!i(n)||u(n))return n;throw l("Can't convert object to primitive value")}return void 0===e&&(e="number"),a(t,e)}},4948:(t,e,n)=>{var r=n(7593),o=n(2190);t.exports=function(t){var e=r(t,"string");return o(e)?e:e+""}},1694:(t,e,n)=>{var r={};r[n(5112)("toStringTag")]="z",t.exports="[object z]"===String(r)},1340:(t,e,n)=>{var r=n(7854),o=n(648),i=r.String;t.exports=function(t){if("Symbol"===o(t))throw TypeError("Cannot convert a Symbol value to a string");return i(t)}},6330:(t,e,n)=>{var r=n(7854).String;t.exports=function(t){try{return r(t)}catch(t){return"Object"}}},9711:(t,e,n)=>{var r=n(1702),o=0,i=Math.random(),u=r(1..toString);t.exports=function(t){return"Symbol("+(void 0===t?"":t)+")_"+u(++o+i,36)}},3307:(t,e,n)=>{var r=n(133);t.exports=r&&!Symbol.sham&&"symbol"==typeof Symbol.iterator},3353:(t,e,n)=>{var r=n(9781),o=n(7293);t.exports=r&&o((function(){return 42!=Object.defineProperty((function(){}),"prototype",{value:42,writable:!1}).prototype}))},8053:(t,e,n)=>{var r=n(7854).TypeError;t.exports=function(t,e){if(t<e)throw r("Not enough arguments");return t}},6061:(t,e,n)=>{var r=n(5112);e.f=r},5112:(t,e,n)=>{var r=n(7854),o=n(2309),i=n(2597),u=n(9711),c=n(133),a=n(3307),s=o("wks"),l=r.Symbol,f=l&&l.for,p=a?l:l&&l.withoutSetter||u;t.exports=function(t){if(!i(s,t)||!c&&"string"!=typeof s[t]){var e="Symbol."+t;c&&i(l,t)?s[t]=l[t]:s[t]=a&&f?f(e):p(e)}return s[t]}},2222:(t,e,n)=>{"use strict";var r=n(2109),o=n(7854),i=n(7293),u=n(3157),c=n(111),a=n(7908),s=n(6244),l=n(6135),f=n(5417),p=n(1194),h=n(5112),v=n(7392),y=h("isConcatSpreadable"),d=9007199254740991,g="Maximum allowed index exceeded",b=o.TypeError,m=v>=51||!i((function(){var t=[];return t[y]=!1,t.concat()[0]!==t})),w=p("concat"),O=function(t){if(!c(t))return!1;var e=t[y];return void 0!==e?!!e:u(t)};r({target:"Array",proto:!0,forced:!m||!w},{concat:function(t){var e,n,r,o,i,u=a(this),c=f(u,0),p=0;for(e=-1,r=arguments.length;e<r;e++)if(O(i=-1===e?u:arguments[e])){if(p+(o=s(i))>d)throw b(g);for(n=0;n<o;n++,p++)n in i&&l(c,p,i[n])}else{if(p>=d)throw b(g);l(c,p++,i)}return c.length=p,c}})},7327:(t,e,n)=>{"use strict";var r=n(2109),o=n(2092).filter;r({target:"Array",proto:!0,forced:!n(1194)("filter")},{filter:function(t){return o(this,t,arguments.length>1?arguments[1]:void 0)}})},1038:(t,e,n)=>{var r=n(2109),o=n(8457);r({target:"Array",stat:!0,forced:!n(7072)((function(t){Array.from(t)}))},{from:o})},6992:(t,e,n)=>{"use strict";var r=n(5656),o=n(1223),i=n(7497),u=n(9909),c=n(3070).f,a=n(654),s=n(1913),l=n(9781),f="Array Iterator",p=u.set,h=u.getterFor(f);t.exports=a(Array,"Array",(function(t,e){p(this,{type:f,target:r(t),index:0,kind:e})}),(function(){var t=h(this),e=t.target,n=t.kind,r=t.index++;return!e||r>=e.length?(t.target=void 0,{value:void 0,done:!0}):"keys"==n?{value:r,done:!1}:"values"==n?{value:e[r],done:!1}:{value:[r,e[r]],done:!1}}),"values");var v=i.Arguments=i.Array;if(o("keys"),o("values"),o("entries"),!s&&l&&"values"!==v.name)try{c(v,"name",{value:"values"})}catch(t){}},1249:(t,e,n)=>{"use strict";var r=n(2109),o=n(2092).map;r({target:"Array",proto:!0,forced:!n(1194)("map")},{map:function(t){return o(this,t,arguments.length>1?arguments[1]:void 0)}})},7042:(t,e,n)=>{"use strict";var r=n(2109),o=n(7854),i=n(3157),u=n(4411),c=n(111),a=n(1400),s=n(6244),l=n(5656),f=n(6135),p=n(5112),h=n(1194),v=n(206),y=h("slice"),d=p("species"),g=o.Array,b=Math.max;r({target:"Array",proto:!0,forced:!y},{slice:function(t,e){var n,r,o,p=l(this),h=s(p),y=a(t,h),m=a(void 0===e?h:e,h);if(i(p)&&(n=p.constructor,(u(n)&&(n===g||i(n.prototype))||c(n)&&null===(n=n[d]))&&(n=void 0),n===g||void 0===n))return v(p,y,m);for(r=new(void 0===n?g:n)(b(m-y,0)),o=0;y<m;y++,o++)y in p&&f(r,o,p[y]);return r.length=o,r}})},8309:(t,e,n)=>{var r=n(9781),o=n(6530).EXISTS,i=n(1702),u=n(3070).f,c=Function.prototype,a=i(c.toString),s=/function\b(?:\s|\/\*[\S\s]*?\*\/|\/\/[^\n\r]*[\n\r]+)*([^\s(/]*)/,l=i(s.exec);r&&!o&&u(c,"name",{configurable:!0,get:function(){try{return l(s,a(this))[1]}catch(t){return""}}})},1532:(t,e,n)=>{"use strict";n(7710)("Map",(function(t){return function(){return t(this,arguments.length?arguments[0]:void 0)}}),n(5631))},489:(t,e,n)=>{var r=n(2109),o=n(7293),i=n(7908),u=n(9518),c=n(8544);r({target:"Object",stat:!0,forced:o((function(){u(1)})),sham:!c},{getPrototypeOf:function(t){return u(i(t))}})},8304:(t,e,n)=>{n(2109)({target:"Object",stat:!0},{setPrototypeOf:n(7674)})},1539:(t,e,n)=>{var r=n(1694),o=n(1320),i=n(288);r||o(Object.prototype,"toString",i,{unsafe:!0})},8674:(t,e,n)=>{"use strict";var r,o,i,u,c=n(2109),a=n(1913),s=n(7854),l=n(5005),f=n(6916),p=n(3366),h=n(1320),v=n(2248),y=n(7674),d=n(8003),g=n(6340),b=n(9662),m=n(614),w=n(111),O=n(5787),P=n(2788),_=n(408),j=n(7072),x=n(6707),R=n(261).set,S=n(5948),k=n(9478),E=n(842),T=n(8523),C=n(2534),I=n(8572),U=n(9909),A=n(4705),F=n(5112),L=n(7871),B=n(5268),N=n(7392),D=F("species"),M="Promise",q=U.getterFor(M),z=U.set,W=U.getterFor(M),G=p&&p.prototype,J=p,H=G,V=s.TypeError,$=s.document,K=s.process,X=T.f,Y=X,Q=!!($&&$.createEvent&&s.dispatchEvent),Z=m(s.PromiseRejectionEvent),tt="unhandledrejection",et=!1,nt=A(M,(function(){var t=P(J),e=t!==String(J);if(!e&&66===N)return!0;if(a&&!H.finally)return!0;if(N>=51&&/native code/.test(t))return!1;var n=new J((function(t){t(1)})),r=function(t){t((function(){}),(function(){}))};return(n.constructor={})[D]=r,!(et=n.then((function(){}))instanceof r)||!e&&L&&!Z})),rt=nt||!j((function(t){J.all(t).catch((function(){}))})),ot=function(t){var e;return!(!w(t)||!m(e=t.then))&&e},it=function(t,e){var n,r,o,i=e.value,u=1==e.state,c=u?t.ok:t.fail,a=t.resolve,s=t.reject,l=t.domain;try{c?(u||(2===e.rejection&&lt(e),e.rejection=1),!0===c?n=i:(l&&l.enter(),n=c(i),l&&(l.exit(),o=!0)),n===t.promise?s(V("Promise-chain cycle")):(r=ot(n))?f(r,n,a,s):a(n)):s(i)}catch(t){l&&!o&&l.exit(),s(t)}},ut=function(t,e){t.notified||(t.notified=!0,S((function(){for(var n,r=t.reactions;n=r.get();)it(n,t);t.notified=!1,e&&!t.rejection&&at(t)})))},ct=function(t,e,n){var r,o;Q?((r=$.createEvent("Event")).promise=e,r.reason=n,r.initEvent(t,!1,!0),s.dispatchEvent(r)):r={promise:e,reason:n},!Z&&(o=s["on"+t])?o(r):t===tt&&E("Unhandled promise rejection",n)},at=function(t){f(R,s,(function(){var e,n=t.facade,r=t.value;if(st(t)&&(e=C((function(){B?K.emit("unhandledRejection",r,n):ct(tt,n,r)})),t.rejection=B||st(t)?2:1,e.error))throw e.value}))},st=function(t){return 1!==t.rejection&&!t.parent},lt=function(t){f(R,s,(function(){var e=t.facade;B?K.emit("rejectionHandled",e):ct("rejectionhandled",e,t.value)}))},ft=function(t,e,n){return function(r){t(e,r,n)}},pt=function(t,e,n){t.done||(t.done=!0,n&&(t=n),t.value=e,t.state=2,ut(t,!0))},ht=function(t,e,n){if(!t.done){t.done=!0,n&&(t=n);try{if(t.facade===e)throw V("Promise can't be resolved itself");var r=ot(e);r?S((function(){var n={done:!1};try{f(r,e,ft(ht,n,t),ft(pt,n,t))}catch(e){pt(n,e,t)}})):(t.value=e,t.state=1,ut(t,!1))}catch(e){pt({done:!1},e,t)}}};if(nt&&(H=(J=function(t){O(this,H),b(t),f(r,this);var e=q(this);try{t(ft(ht,e),ft(pt,e))}catch(t){pt(e,t)}}).prototype,(r=function(t){z(this,{type:M,done:!1,notified:!1,parent:!1,reactions:new I,rejection:!1,state:0,value:void 0})}).prototype=v(H,{then:function(t,e){var n=W(this),r=X(x(this,J));return n.parent=!0,r.ok=!m(t)||t,r.fail=m(e)&&e,r.domain=B?K.domain:void 0,0==n.state?n.reactions.add(r):S((function(){it(r,n)})),r.promise},catch:function(t){return this.then(void 0,t)}}),o=function(){var t=new r,e=q(t);this.promise=t,this.resolve=ft(ht,e),this.reject=ft(pt,e)},T.f=X=function(t){return t===J||t===i?new o(t):Y(t)},!a&&m(p)&&G!==Object.prototype)){u=G.then,et||(h(G,"then",(function(t,e){var n=this;return new J((function(t,e){f(u,n,t,e)})).then(t,e)}),{unsafe:!0}),h(G,"catch",H.catch,{unsafe:!0}));try{delete G.constructor}catch(t){}y&&y(G,H)}c({global:!0,wrap:!0,forced:nt},{Promise:J}),d(J,M,!1,!0),g(M),i=l(M),c({target:M,stat:!0,forced:nt},{reject:function(t){var e=X(this);return f(e.reject,void 0,t),e.promise}}),c({target:M,stat:!0,forced:a||nt},{resolve:function(t){return k(a&&this===i?J:this,t)}}),c({target:M,stat:!0,forced:rt},{all:function(t){var e=this,n=X(e),r=n.resolve,o=n.reject,i=C((function(){var n=b(e.resolve),i=[],u=0,c=1;_(t,(function(t){var a=u++,s=!1;c++,f(n,e,t).then((function(t){s||(s=!0,i[a]=t,--c||r(i))}),o)})),--c||r(i)}));return i.error&&o(i.value),n.promise},race:function(t){var e=this,n=X(e),r=n.reject,o=C((function(){var o=b(e.resolve);_(t,(function(t){f(o,e,t).then(n.resolve,r)}))}));return o.error&&r(o.value),n.promise}})},2419:(t,e,n)=>{var r=n(2109),o=n(5005),i=n(2104),u=n(7065),c=n(9483),a=n(9670),s=n(111),l=n(30),f=n(7293),p=o("Reflect","construct"),h=Object.prototype,v=[].push,y=f((function(){function t(){}return!(p((function(){}),[],t)instanceof t)})),d=!f((function(){p((function(){}))})),g=y||d;r({target:"Reflect",stat:!0,forced:g,sham:g},{construct:function(t,e){c(t),a(e);var n=arguments.length<3?t:c(arguments[2]);if(d&&!y)return p(t,e,n);if(t==n){switch(e.length){case 0:return new t;case 1:return new t(e[0]);case 2:return new t(e[0],e[1]);case 3:return new t(e[0],e[1],e[2]);case 4:return new t(e[0],e[1],e[2],e[3])}var r=[null];return i(v,r,e),new(i(u,t,r))}var o=n.prototype,f=l(s(o)?o:h),g=i(t,f,e);return s(g)?g:f}})},4916:(t,e,n)=>{"use strict";var r=n(2109),o=n(2261);r({target:"RegExp",proto:!0,forced:/./.exec!==o},{exec:o})},9714:(t,e,n)=>{"use strict";var r=n(1702),o=n(6530).PROPER,i=n(1320),u=n(9670),c=n(7976),a=n(1340),s=n(7293),l=n(7066),f="toString",p=RegExp.prototype,h=p.toString,v=r(l),y=s((function(){return"/a/b"!=h.call({source:"a",flags:"b"})})),d=o&&h.name!=f;(y||d)&&i(RegExp.prototype,f,(function(){var t=u(this),e=a(t.source),n=t.flags;return"/"+e+"/"+a(void 0===n&&c(p,t)&&!("flags"in p)?v(t):n)}),{unsafe:!0})},8783:(t,e,n)=>{"use strict";var r=n(8710).charAt,o=n(1340),i=n(9909),u=n(654),c="String Iterator",a=i.set,s=i.getterFor(c);u(String,"String",(function(t){a(this,{type:c,string:o(t),index:0})}),(function(){var t,e=s(this),n=e.string,o=e.index;return o>=n.length?{value:void 0,done:!0}:(t=r(n,o),e.index+=t.length,{value:t,done:!1})}))},1817:(t,e,n)=>{"use strict";var r=n(2109),o=n(9781),i=n(7854),u=n(1702),c=n(2597),a=n(614),s=n(7976),l=n(1340),f=n(3070).f,p=n(9920),h=i.Symbol,v=h&&h.prototype;if(o&&a(h)&&(!("description"in v)||void 0!==h().description)){var y={},d=function(){var t=arguments.length<1||void 0===arguments[0]?void 0:l(arguments[0]),e=s(v,this)?new h(t):void 0===t?h():h(t);return""===t&&(y[e]=!0),e};p(d,h),d.prototype=v,v.constructor=d;var g="Symbol(test)"==String(h("test")),b=u(v.toString),m=u(v.valueOf),w=/^Symbol\((.*)\)[^)]+$/,O=u("".replace),P=u("".slice);f(v,"description",{configurable:!0,get:function(){var t=m(this),e=b(t);if(c(y,t))return"";var n=g?P(e,7,-1):O(e,w,"$1");return""===n?void 0:n}}),r({global:!0,forced:!0},{Symbol:d})}},2165:(t,e,n)=>{n(7235)("iterator")},2526:(t,e,n)=>{"use strict";var r=n(2109),o=n(7854),i=n(5005),u=n(2104),c=n(6916),a=n(1702),s=n(1913),l=n(9781),f=n(133),p=n(7293),h=n(2597),v=n(3157),y=n(614),d=n(111),g=n(7976),b=n(2190),m=n(9670),w=n(7908),O=n(5656),P=n(4948),_=n(1340),j=n(9114),x=n(30),R=n(1956),S=n(8006),k=n(1156),E=n(5181),T=n(1236),C=n(3070),I=n(6048),U=n(5296),A=n(206),F=n(1320),L=n(2309),B=n(6200),N=n(3501),D=n(9711),M=n(5112),q=n(6061),z=n(7235),W=n(8003),G=n(9909),J=n(2092).forEach,H=B("hidden"),V="Symbol",$=M("toPrimitive"),K=G.set,X=G.getterFor(V),Y=Object.prototype,Q=o.Symbol,Z=Q&&Q.prototype,tt=o.TypeError,et=o.QObject,nt=i("JSON","stringify"),rt=T.f,ot=C.f,it=k.f,ut=U.f,ct=a([].push),at=L("symbols"),st=L("op-symbols"),lt=L("string-to-symbol-registry"),ft=L("symbol-to-string-registry"),pt=L("wks"),ht=!et||!et.prototype||!et.prototype.findChild,vt=l&&p((function(){return 7!=x(ot({},"a",{get:function(){return ot(this,"a",{value:7}).a}})).a}))?function(t,e,n){var r=rt(Y,e);r&&delete Y[e],ot(t,e,n),r&&t!==Y&&ot(Y,e,r)}:ot,yt=function(t,e){var n=at[t]=x(Z);return K(n,{type:V,tag:t,description:e}),l||(n.description=e),n},dt=function(t,e,n){t===Y&&dt(st,e,n),m(t);var r=P(e);return m(n),h(at,r)?(n.enumerable?(h(t,H)&&t[H][r]&&(t[H][r]=!1),n=x(n,{enumerable:j(0,!1)})):(h(t,H)||ot(t,H,j(1,{})),t[H][r]=!0),vt(t,r,n)):ot(t,r,n)},gt=function(t,e){m(t);var n=O(e),r=R(n).concat(Ot(n));return J(r,(function(e){l&&!c(bt,n,e)||dt(t,e,n[e])})),t},bt=function(t){var e=P(t),n=c(ut,this,e);return!(this===Y&&h(at,e)&&!h(st,e))&&(!(n||!h(this,e)||!h(at,e)||h(this,H)&&this[H][e])||n)},mt=function(t,e){var n=O(t),r=P(e);if(n!==Y||!h(at,r)||h(st,r)){var o=rt(n,r);return!o||!h(at,r)||h(n,H)&&n[H][r]||(o.enumerable=!0),o}},wt=function(t){var e=it(O(t)),n=[];return J(e,(function(t){h(at,t)||h(N,t)||ct(n,t)})),n},Ot=function(t){var e=t===Y,n=it(e?st:O(t)),r=[];return J(n,(function(t){!h(at,t)||e&&!h(Y,t)||ct(r,at[t])})),r};if(f||(Q=function(){if(g(Z,this))throw tt("Symbol is not a constructor");var t=arguments.length&&void 0!==arguments[0]?_(arguments[0]):void 0,e=D(t),n=function(t){this===Y&&c(n,st,t),h(this,H)&&h(this[H],e)&&(this[H][e]=!1),vt(this,e,j(1,t))};return l&&ht&&vt(Y,e,{configurable:!0,set:n}),yt(e,t)},F(Z=Q.prototype,"toString",(function(){return X(this).tag})),F(Q,"withoutSetter",(function(t){return yt(D(t),t)})),U.f=bt,C.f=dt,I.f=gt,T.f=mt,S.f=k.f=wt,E.f=Ot,q.f=function(t){return yt(M(t),t)},l&&(ot(Z,"description",{configurable:!0,get:function(){return X(this).description}}),s||F(Y,"propertyIsEnumerable",bt,{unsafe:!0}))),r({global:!0,wrap:!0,forced:!f,sham:!f},{Symbol:Q}),J(R(pt),(function(t){z(t)})),r({target:V,stat:!0,forced:!f},{for:function(t){var e=_(t);if(h(lt,e))return lt[e];var n=Q(e);return lt[e]=n,ft[n]=e,n},keyFor:function(t){if(!b(t))throw tt(t+" is not a symbol");if(h(ft,t))return ft[t]},useSetter:function(){ht=!0},useSimple:function(){ht=!1}}),r({target:"Object",stat:!0,forced:!f,sham:!l},{create:function(t,e){return void 0===e?x(t):gt(x(t),e)},defineProperty:dt,defineProperties:gt,getOwnPropertyDescriptor:mt}),r({target:"Object",stat:!0,forced:!f},{getOwnPropertyNames:wt,getOwnPropertySymbols:Ot}),r({target:"Object",stat:!0,forced:p((function(){E.f(1)}))},{getOwnPropertySymbols:function(t){return E.f(w(t))}}),nt&&r({target:"JSON",stat:!0,forced:!f||p((function(){var t=Q();return"[null]"!=nt([t])||"{}"!=nt({a:t})||"{}"!=nt(Object(t))}))},{stringify:function(t,e,n){var r=A(arguments),o=e;if((d(e)||void 0!==t)&&!b(t))return v(e)||(e=function(t,e){if(y(o)&&(e=c(o,this,t,e)),!b(e))return e}),r[1]=e,u(nt,null,r)}}),!Z[$]){var Pt=Z.valueOf;F(Z,$,(function(t){return c(Pt,this)}))}W(Q,V),N[H]=!0},3948:(t,e,n)=>{var r=n(7854),o=n(8324),i=n(8509),u=n(6992),c=n(8880),a=n(5112),s=a("iterator"),l=a("toStringTag"),f=u.values,p=function(t,e){if(t){if(t[s]!==f)try{c(t,s,f)}catch(e){t[s]=f}if(t[l]||c(t,l,e),o[e])for(var n in u)if(t[n]!==u[n])try{c(t,n,u[n])}catch(e){t[n]=u[n]}}};for(var h in o)p(r[h]&&r[h].prototype,h);p(i,"DOMTokenList")}},e={};function n(r){var o=e[r];if(void 0!==o)return o.exports;var i=e[r]={exports:{}};return t[r](i,i.exports,n),i.exports}n.n=t=>{var e=t&&t.__esModule?()=>t.default:()=>t;return n.d(e,{a:e}),e},n.d=(t,e)=>{for(var r in e)n.o(e,r)&&!n.o(t,r)&&Object.defineProperty(t,r,{enumerable:!0,get:e[r]})},n.g=function(){if("object"==typeof globalThis)return globalThis;try{return this||new Function("return this")()}catch(t){if("object"==typeof window)return window}}(),n.o=(t,e)=>Object.prototype.hasOwnProperty.call(t,e),n.r=t=>{"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(t,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(t,"__esModule",{value:!0})};var r={};return(()=>{"use strict";n.r(r),n.d(r,{AllFeedFileList:()=>ft,AllPipelineInstanceList:()=>Mt,AllPluginInstanceList:()=>Qt,AllWorkflowList:()=>Pr,ChrisInstance:()=>L,Collection:()=>u,Comment:()=>Qn,CommentList:()=>Zn,ComputeResource:()=>Ne,ComputeResourceList:()=>De,Feed:()=>sr,FeedFile:()=>st,FeedFileList:()=>lt,FeedList:()=>lr,FeedPluginInstanceList:()=>Zt,FeedTagList:()=>zn,FeedTaggingList:()=>Mn,FileBrowserPath:()=>Ar,FileBrowserPathFile:()=>Ir,FileBrowserPathFileList:()=>Ur,FileBrowserPathList:()=>Fr,ItemResource:()=>T,ListResource:()=>C,Note:()=>Rn,PACSFile:()=>an,PACSFileList:()=>sn,Pipeline:()=>Pt,PipelineInstance:()=>Nt,PipelineInstanceList:()=>Dt,PipelineInstancePluginInstanceList:()=>te,PipelineList:()=>_t,PipelinePipingDefaultParameterList:()=>kt,PipelinePluginList:()=>Rt,PipelinePluginPipingList:()=>St,PipingDefaultParameter:()=>xt,Plugin:()=>Re,PluginComputeResourceList:()=>Me,PluginInstance:()=>Xt,PluginInstanceDescendantList:()=>ee,PluginInstanceFileList:()=>pt,PluginInstanceList:()=>Yt,PluginInstanceParameter:()=>oe,PluginInstanceParameterList:()=>ie,PluginInstanceSplit:()=>ne,PluginInstanceSplitList:()=>re,PluginList:()=>Se,PluginMeta:()=>ye,PluginMetaList:()=>de,PluginMetaPluginList:()=>ke,PluginParameter:()=>Q,PluginParameterList:()=>Z,PluginPiping:()=>jt,Request:()=>b,RequestException:()=>y,Resource:()=>E,ServiceFile:()=>mn,ServiceFileList:()=>wn,Tag:()=>Ln,TagFeedList:()=>qn,TagList:()=>Bn,TagTaggingList:()=>Dn,Tagging:()=>Nn,UploadedFile:()=>Xe,UploadedFileList:()=>Ye,User:()=>z,Workflow:()=>wr,WorkflowList:()=>Or,default:()=>Mr}),n(7042),n(1539),n(8309),n(1038),n(8783),n(4916),n(2526),n(1817),n(2165),n(6992),n(3948),n(8304),n(489),n(2419);var t=n(9669),e=n.n(t);function o(t,e){(null==e||e>t.length)&&(e=t.length);for(var n=0,r=new Array(e);n<e;n++)r[n]=t[n];return r}function i(t,e){for(var n=0;n<e.length;n++){var r=e[n];r.enumerable=r.enumerable||!1,r.configurable=!0,"value"in r&&(r.writable=!0),Object.defineProperty(t,r.key,r)}}n(7327),n(1249);var u=function(){function t(){!function(t,e){if(!(t instanceof e))throw new TypeError("Cannot call a class as a function")}(this,t)}var e,n;return e=t,n=[{key:"getErrorMessage",value:function(t){return t.error?t.error.message:""}},{key:"getLinkRelationUrls",value:function(t,e){return t.links.filter((function(t){return t.rel===e})).map((function(t){return t.href}))}},{key:"getItemDescriptors",value:function(t){var e,n={},r=function(t,e){var n="undefined"!=typeof Symbol&&t[Symbol.iterator]||t["@@iterator"];if(!n){if(Array.isArray(t)||(n=function(t,e){if(t){if("string"==typeof t)return o(t,e);var n=Object.prototype.toString.call(t).slice(8,-1);return"Object"===n&&t.constructor&&(n=t.constructor.name),"Map"===n||"Set"===n?Array.from(t):"Arguments"===n||/^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)?o(t,e):void 0}}(t))||e&&t&&"number"==typeof t.length){n&&(t=n);var r=0,i=function(){};return{s:i,n:function(){return r>=t.length?{done:!0}:{done:!1,value:t[r++]}},e:function(t){throw t},f:i}}throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")}var u,c=!0,a=!1;return{s:function(){n=n.call(t)},n:function(){var t=n.next();return c=t.done,t},e:function(t){a=!0,u=t},f:function(){try{c||null==n.return||n.return()}finally{if(a)throw u}}}}(t.data);try{for(r.s();!(e=r.n()).done;){var i=e.value;n[i.name]=i.value}}catch(t){r.e(t)}finally{r.f()}return n}},{key:"getUrl",value:function(t){return t.href}},{key:"getTotalNumberOfItems",value:function(t){return t.total?t.total:-1}},{key:"getTemplateDescriptorNames",value:function(t){return t.data.map((function(t){return t.name}))}},{key:"getQueryParameters",value:function(t){return t[0].data.map((function(t){return t.name}))}},{key:"createCollectionObj",value:function(){return{href:"",items:[],links:[],version:"1.0"}}},{key:"makeTemplate",value:function(t){var e={data:[]},n=0;for(var r in t)t.hasOwnProperty(r)&&(e.data[n]={name:r,value:t[r]}),n++;return e}}],null&&i(e.prototype,null),n&&i(e,n),Object.defineProperty(e,"prototype",{writable:!1}),t}();function c(t){return c="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(t){return typeof t}:function(t){return t&&"function"==typeof Symbol&&t.constructor===Symbol&&t!==Symbol.prototype?"symbol":typeof t},c(t)}function a(t,e){if(!(t instanceof e))throw new TypeError("Cannot call a class as a function")}function s(t,e){if(e&&("object"===c(e)||"function"==typeof e))return e;if(void 0!==e)throw new TypeError("Derived constructors may only return object or undefined");return function(t){if(void 0===t)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return t}(t)}function l(t){var e="function"==typeof Map?new Map:void 0;return l=function(t){if(null===t||(n=t,-1===Function.toString.call(n).indexOf("[native code]")))return t;var n;if("function"!=typeof t)throw new TypeError("Super expression must either be null or a function");if(void 0!==e){if(e.has(t))return e.get(t);e.set(t,r)}function r(){return f(t,arguments,v(this).constructor)}return r.prototype=Object.create(t.prototype,{constructor:{value:r,enumerable:!1,writable:!0,configurable:!0}}),h(r,t)},l(t)}function f(t,e,n){return f=p()?Reflect.construct:function(t,e,n){var r=[null];r.push.apply(r,e);var o=new(Function.bind.apply(t,r));return n&&h(o,n.prototype),o},f.apply(null,arguments)}function p(){if("undefined"==typeof Reflect||!Reflect.construct)return!1;if(Reflect.construct.sham)return!1;if("function"==typeof Proxy)return!0;try{return Boolean.prototype.valueOf.call(Reflect.construct(Boolean,[],(function(){}))),!0}catch(t){return!1}}function h(t,e){return h=Object.setPrototypeOf||function(t,e){return t.__proto__=e,t},h(t,e)}function v(t){return v=Object.setPrototypeOf?Object.getPrototypeOf:function(t){return t.__proto__||Object.getPrototypeOf(t)},v(t)}n(2222),n(9714),n(1532);var y=function(t){!function(t,e){if("function"!=typeof e&&null!==e)throw new TypeError("Super expression must either be null or a function");t.prototype=Object.create(e&&e.prototype,{constructor:{value:t,writable:!0,configurable:!0}}),Object.defineProperty(t,"prototype",{writable:!1}),e&&h(t,e)}(i,t);var e,n,r,o=(e=i,n=p(),function(){var t,r=v(e);if(n){var o=v(this).constructor;t=Reflect.construct(r,arguments,o)}else t=r.apply(this,arguments);return s(this,t)});function i(){var t;a(this,i);for(var e=arguments.length,n=new Array(e),r=0;r<e;r++)n[r]=arguments[r];return(t=o.call.apply(o,[this].concat(n))).name=t.constructor.name,t.request=null,t.response=null,t}return r=i,Object.defineProperty(r,"prototype",{writable:!1}),r}(l(Error));function d(t,e){if(!(t instanceof e))throw new TypeError("Cannot call a class as a function")}function g(t,e){for(var n=0;n<e.length;n++){var r=e[n];r.enumerable=r.enumerable||!1,r.configurable=!0,"value"in r&&(r.writable=!0),Object.defineProperty(t,r.key,r)}}var b=function(){function t(e,n){var r=arguments.length>2&&void 0!==arguments[2]?arguments[2]:3e4;d(this,t),this.auth=e,this.contentType=n,this.timeout=r}var n,r,o;return n=t,r=[{key:"get",value:function(e){var n=arguments.length>1&&void 0!==arguments[1]?arguments[1]:null,r=this._getConfig(e,"get");return n&&(r.params=n),t._callAxios(r)}},{key:"post",value:function(t,e){var n=arguments.length>2&&void 0!==arguments[2]?arguments[2]:null;return this._postOrPut("post",t,e,n)}},{key:"put",value:function(t,e){var n=arguments.length>2&&void 0!==arguments[2]?arguments[2]:null;return this._postOrPut("put",t,e,n)}},{key:"delete",value:function(e){var n=this._getConfig(e,"delete");return t._callAxios(n)}},{key:"_postOrPut",value:function(e,n,r){var o=arguments.length>3&&void 0!==arguments[3]?arguments[3]:null,i=this._getConfig(n,e);if(i.data=r,o){i.headers["content-type"]="multipart/form-data";var u=new FormData;for(var c in r)r.hasOwnProperty(c)&&u.set(c,r[c]);for(var a in o)o.hasOwnProperty(a)&&u.set(a,o[a]);i.data=u}return t._callAxios(i)}},{key:"_getConfig",value:function(t,e){var n={url:t,method:e,headers:{Accept:this.contentType,"content-type":this.contentType},timeout:this.timeout};return this.auth&&this.auth.username&&this.auth.password?n.auth=this.auth:this.auth&&this.auth.token&&(n.headers.Authorization="Token "+this.auth.token),"application/octet-stream"===this.contentType&&(n.responseType="blob"),n}}],o=[{key:"_callAxios",value:function(n){return e()(n).then((function(t){return t})).catch((function(e){t._handleRequestError(e)}))}},{key:"_handleRequestError",value:function(t){var e;if(t.response){var n="Bad server response!";t.response.data.collection&&(n=u.getErrorMessage(t.response.data.collection)),(e=new y(n)).request=t.request,e.response=t.response;try{e.response.data=JSON.parse(n)}catch(t){e.response.data=n}}else t.request?(e=new y("No server response!")).request=t.request:e=new y(t.message);throw e}},{key:"runAsyncTask",value:function(t){var e=t(),n=e.next();!function t(){n.done||n.value.then((function(r){n=e.next(r),t()})).catch((function(r){n=e.throw(r),t()}))}()}}],r&&g(n.prototype,r),o&&g(n,o),Object.defineProperty(n,"prototype",{writable:!1}),t}();function m(t,e){(null==e||e>t.length)&&(e=t.length);for(var n=0,r=new Array(e);n<e;n++)r[n]=t[n];return r}function w(t,e){if("function"!=typeof e&&null!==e)throw new TypeError("Super expression must either be null or a function");t.prototype=Object.create(e&&e.prototype,{constructor:{value:t,writable:!0,configurable:!0}}),Object.defineProperty(t,"prototype",{writable:!1}),e&&O(t,e)}function O(t,e){return O=Object.setPrototypeOf||function(t,e){return t.__proto__=e,t},O(t,e)}function P(t){var e=function(){if("undefined"==typeof Reflect||!Reflect.construct)return!1;if(Reflect.construct.sham)return!1;if("function"==typeof Proxy)return!0;try{return Boolean.prototype.valueOf.call(Reflect.construct(Boolean,[],(function(){}))),!0}catch(t){return!1}}();return function(){var n,r=j(t);if(e){var o=j(this).constructor;n=Reflect.construct(r,arguments,o)}else n=r.apply(this,arguments);return _(this,n)}}function _(t,e){if(e&&("object"===x(e)||"function"==typeof e))return e;if(void 0!==e)throw new TypeError("Derived constructors may only return object or undefined");return function(t){if(void 0===t)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return t}(t)}function j(t){return j=Object.setPrototypeOf?Object.getPrototypeOf:function(t){return t.__proto__||Object.getPrototypeOf(t)},j(t)}function x(t){return x="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(t){return typeof t}:function(t){return t&&"function"==typeof Symbol&&t.constructor===Symbol&&t!==Symbol.prototype?"symbol":typeof t},x(t)}function R(t,e){if(!(t instanceof e))throw new TypeError("Cannot call a class as a function")}function S(t,e){for(var n=0;n<e.length;n++){var r=e[n];r.enumerable=r.enumerable||!1,r.configurable=!0,"value"in r&&(r.writable=!0),Object.defineProperty(t,r.key,r)}}function k(t,e,n){return e&&S(t.prototype,e),n&&S(t,n),Object.defineProperty(t,"prototype",{writable:!1}),t}var E=function(){function t(e,n){if(R(this,t),this.url=e,!n)throw new y("Authentication object is required");this.auth=n,this.contentType="application/vnd.collection+json",this.collection=null}return k(t,[{key:"isEmpty",get:function(){return!this.collection||!this.collection.items.length}},{key:"clone",value:function(){return t.cloneObj(this)}}],[{key:"cloneObj",value:function(t){var e=Object.create(Object.getPrototypeOf(t));for(var n in t)null!==t[n]&&"object"===x(t[n])?e[n]=JSON.parse(JSON.stringify(t[n])):e[n]=t[n];return e}}]),t}(),T=function(t){w(n,t);var e=P(n);function n(t,r){return R(this,n),e.call(this,t,r)}return k(n,[{key:"get",value:function(){var t=this,e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:3e4,n=new b(this.auth,this.contentType,e);return n.get(this.url).then((function(e){return t.collection=null,e.data&&e.data.collection&&(t.collection=e.data.collection),t}))}},{key:"data",get:function(){return this.isEmpty?null:u.getItemDescriptors(this.collection.items[0])}},{key:"getPUTParameters",value:function(){return this.collection&&this.collection.template?u.getTemplateDescriptorNames(this.collection.template):null}},{key:"_getResource",value:function(t,e){var n=arguments.length>2&&void 0!==arguments[2]?arguments[2]:null,r=arguments.length>3&&void 0!==arguments[3]?arguments[3]:3e4;if(this.isEmpty)throw new y("Item object has not been set!");var o=this.collection.items[0],i=u.getLinkRelationUrls(o,t);if(!i.length){var c='Missing "'+t+'" link relation!';throw new y(c)}var a=i[0],s=new e(a,this.auth);return n?s.get(n,r):s.get(r)}},{key:"_put",value:function(t,e){var n=this,r=arguments.length>2&&void 0!==arguments[2]?arguments[2]:3e4,o=new b(this.auth,this.contentType,r),i=t;return e||"application/vnd.collection+json"!==this.contentType||(i={template:u.makeTemplate(t)}),o.put(this.url,i,e).then((function(t){return n.collection=null,t.data&&t.data.collection&&(n.collection=t.data.collection),n}))}},{key:"_delete",value:function(){var t=this,e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:3e4,n=new b(this.auth,this.contentType,e);return n.delete(this.url).then((function(){t.collection=null}))}}]),n}(E),C=function(t){w(n,t);var e=P(n);function n(t,r){var o;return R(this,n),(o=e.call(this,t,r)).queryUrl="",o.searchParams=null,o.itemClass=T,o}return k(n,[{key:"get",value:function(){var t=this,e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:null,n=arguments.length>1&&void 0!==arguments[1]?arguments[1]:3e4,r=new b(this.auth,this.contentType,n),o=function(n){return t.collection=null,t.searchParams=e,n.data&&n.data.collection&&(t.collection=n.data.collection,t.collection.queries&&t.collection.queries.length&&(t.queryUrl=t.collection.queries[0].href)),t};if(e){for(var i in e)if(e.hasOwnProperty(i)&&"limit"!==i&&"offset"!==i)return this.queryUrl=this.queryUrl||this.url+"search/",r.get(this.queryUrl,e).then(o);return r.get(this.url,e).then(o)}return r.get(this.url).then(o)}},{key:"getSearchParameters",value:function(){if(this.collection){if(this.collection.queries){var t=u.getQueryParameters(this.collection.queries);return t.push("limit","offset"),t}return["limit","offset"]}return null}},{key:"getItem",value:function(t){if(this.isEmpty)return null;var e=this.collection.items.filter((function(e){return u.getItemDescriptors(e).id===t}));if(!e.length)return null;var n=new this.itemClass(e[0].href,this.auth);return n.collection=u.createCollectionObj(),n.collection.items.push(e[0]),n.collection.href=e[0].href,n}},{key:"getItems",value:function(){var t=this;return this.isEmpty?[]:this.collection.items.map((function(e){var n=new t.itemClass(e.href,t.auth);return n.collection=u.createCollectionObj(),n.collection.items.push(e),n.collection.href=e.href,n}))}},{key:"data",get:function(){if(this.isEmpty)return null;var t,e=[],n=function(t,e){var n="undefined"!=typeof Symbol&&t[Symbol.iterator]||t["@@iterator"];if(!n){if(Array.isArray(t)||(n=function(t,e){if(t){if("string"==typeof t)return m(t,e);var n=Object.prototype.toString.call(t).slice(8,-1);return"Object"===n&&t.constructor&&(n=t.constructor.name),"Map"===n||"Set"===n?Array.from(t):"Arguments"===n||/^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)?m(t,e):void 0}}(t))||e&&t&&"number"==typeof t.length){n&&(t=n);var r=0,o=function(){};return{s:o,n:function(){return r>=t.length?{done:!0}:{done:!1,value:t[r++]}},e:function(t){throw t},f:o}}throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")}var i,u=!0,c=!1;return{s:function(){n=n.call(t)},n:function(){var t=n.next();return u=t.done,t},e:function(t){c=!0,i=t},f:function(){try{u||null==n.return||n.return()}finally{if(c)throw i}}}}(this.collection.items);try{for(n.s();!(t=n.n()).done;){var r=t.value;e.push(u.getItemDescriptors(r))}}catch(t){n.e(t)}finally{n.f()}return e}},{key:"totalCount",get:function(){return this.collection?u.getTotalNumberOfItems(this.collection):-1}},{key:"hasNextPage",get:function(){return!(!this.collection||!u.getLinkRelationUrls(this.collection,"next").length)}},{key:"hasPreviousPage",get:function(){return!(!this.collection||!u.getLinkRelationUrls(this.collection,"previous").length)}},{key:"getPOSTParameters",value:function(){return this.collection&&this.collection.template?u.getTemplateDescriptorNames(this.collection.template):null}},{key:"_getResource",value:function(t,e){var n=arguments.length>2&&void 0!==arguments[2]?arguments[2]:null,r=arguments.length>3&&void 0!==arguments[3]?arguments[3]:3e4;if(!this.collection)throw new y("Collection object has not been set!");var o=u.getLinkRelationUrls(this.collection,t);if(!o.length){var i='Missing "'+t+'" link relation!';throw new y(i)}var c=o[0],a=new e(c,this.auth);return n?a.get(n,r):a.get(r)}},{key:"_post",value:function(t,e){var n=this,r=arguments.length>2&&void 0!==arguments[2]?arguments[2]:3e4,o=this.url,i=new b(this.auth,this.contentType,r),c=t;return e||"application/vnd.collection+json"!==this.contentType||(c={template:u.makeTemplate(t)}),i.post(o,c,e).then((function(t){return n.collection=null,n.searchParams=null,t.data&&t.data.collection&&(n.collection=t.data.collection),n}))}}]),n}(E);function I(t){return I="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(t){return typeof t}:function(t){return t&&"function"==typeof Symbol&&t.constructor===Symbol&&t!==Symbol.prototype?"symbol":typeof t},I(t)}function U(t,e){return U=Object.setPrototypeOf||function(t,e){return t.__proto__=e,t},U(t,e)}function A(t,e){if(e&&("object"===I(e)||"function"==typeof e))return e;if(void 0!==e)throw new TypeError("Derived constructors may only return object or undefined");return function(t){if(void 0===t)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return t}(t)}function F(t){return F=Object.setPrototypeOf?Object.getPrototypeOf:function(t){return t.__proto__||Object.getPrototypeOf(t)},F(t)}var L=function(t){!function(t,e){if("function"!=typeof e&&null!==e)throw new TypeError("Super expression must either be null or a function");t.prototype=Object.create(e&&e.prototype,{constructor:{value:t,writable:!0,configurable:!0}}),Object.defineProperty(t,"prototype",{writable:!1}),e&&U(t,e)}(i,t);var e,n,r,o=(n=i,r=function(){if("undefined"==typeof Reflect||!Reflect.construct)return!1;if(Reflect.construct.sham)return!1;if("function"==typeof Proxy)return!0;try{return Boolean.prototype.valueOf.call(Reflect.construct(Boolean,[],(function(){}))),!0}catch(t){return!1}}(),function(){var t,e=F(n);if(r){var o=F(this).constructor;t=Reflect.construct(e,arguments,o)}else t=e.apply(this,arguments);return A(this,t)});function i(t,e){return function(t,e){if(!(t instanceof e))throw new TypeError("Cannot call a class as a function")}(this,i),o.call(this,t,e)}return e=i,Object.defineProperty(e,"prototype",{writable:!1}),e}(T);function B(t){return B="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(t){return typeof t}:function(t){return t&&"function"==typeof Symbol&&t.constructor===Symbol&&t!==Symbol.prototype?"symbol":typeof t},B(t)}function N(t,e){for(var n=0;n<e.length;n++){var r=e[n];r.enumerable=r.enumerable||!1,r.configurable=!0,"value"in r&&(r.writable=!0),Object.defineProperty(t,r.key,r)}}function D(t,e){return D=Object.setPrototypeOf||function(t,e){return t.__proto__=e,t},D(t,e)}function M(t,e){if(e&&("object"===B(e)||"function"==typeof e))return e;if(void 0!==e)throw new TypeError("Derived constructors may only return object or undefined");return function(t){if(void 0===t)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return t}(t)}function q(t){return q=Object.setPrototypeOf?Object.getPrototypeOf:function(t){return t.__proto__||Object.getPrototypeOf(t)},q(t)}var z=function(t){!function(t,e){if("function"!=typeof e&&null!==e)throw new TypeError("Super expression must either be null or a function");t.prototype=Object.create(e&&e.prototype,{constructor:{value:t,writable:!0,configurable:!0}}),Object.defineProperty(t,"prototype",{writable:!1}),e&&D(t,e)}(u,t);var e,n,r,o,i=(r=u,o=function(){if("undefined"==typeof Reflect||!Reflect.construct)return!1;if(Reflect.construct.sham)return!1;if("function"==typeof Proxy)return!0;try{return Boolean.prototype.valueOf.call(Reflect.construct(Boolean,[],(function(){}))),!0}catch(t){return!1}}(),function(){var t,e=q(r);if(o){var n=q(this).constructor;t=Reflect.construct(e,arguments,n)}else t=e.apply(this,arguments);return M(this,t)});function u(t,e){return function(t,e){if(!(t instanceof e))throw new TypeError("Cannot call a class as a function")}(this,u),i.call(this,t,e)}return e=u,n=[{key:"put",value:function(t){var e=arguments.length>1&&void 0!==arguments[1]?arguments[1]:3e4;return this._put(t,null,e)}}],n&&N(e.prototype,n),Object.defineProperty(e,"prototype",{writable:!1}),u}(T);function W(t){return W="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(t){return typeof t}:function(t){return t&&"function"==typeof Symbol&&t.constructor===Symbol&&t!==Symbol.prototype?"symbol":typeof t},W(t)}function G(t,e){if(!(t instanceof e))throw new TypeError("Cannot call a class as a function")}function J(t,e){for(var n=0;n<e.length;n++){var r=e[n];r.enumerable=r.enumerable||!1,r.configurable=!0,"value"in r&&(r.writable=!0),Object.defineProperty(t,r.key,r)}}function H(t,e,n){return e&&J(t.prototype,e),n&&J(t,n),Object.defineProperty(t,"prototype",{writable:!1}),t}function V(t,e){if("function"!=typeof e&&null!==e)throw new TypeError("Super expression must either be null or a function");t.prototype=Object.create(e&&e.prototype,{constructor:{value:t,writable:!0,configurable:!0}}),Object.defineProperty(t,"prototype",{writable:!1}),e&&$(t,e)}function $(t,e){return $=Object.setPrototypeOf||function(t,e){return t.__proto__=e,t},$(t,e)}function K(t){var e=function(){if("undefined"==typeof Reflect||!Reflect.construct)return!1;if(Reflect.construct.sham)return!1;if("function"==typeof Proxy)return!0;try{return Boolean.prototype.valueOf.call(Reflect.construct(Boolean,[],(function(){}))),!0}catch(t){return!1}}();return function(){var n,r=Y(t);if(e){var o=Y(this).constructor;n=Reflect.construct(r,arguments,o)}else n=r.apply(this,arguments);return X(this,n)}}function X(t,e){if(e&&("object"===W(e)||"function"==typeof e))return e;if(void 0!==e)throw new TypeError("Derived constructors may only return object or undefined");return function(t){if(void 0===t)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return t}(t)}function Y(t){return Y=Object.setPrototypeOf?Object.getPrototypeOf:function(t){return t.__proto__||Object.getPrototypeOf(t)},Y(t)}var Q=function(t){V(n,t);var e=K(n);function n(t,r){return G(this,n),e.call(this,t,r)}return H(n,[{key:"getPlugin",value:function(){var t=arguments.length>0&&void 0!==arguments[0]?arguments[0]:3e4,e="plugin",n=Re;return this._getResource(e,n,null,t)}}]),n}(T),Z=function(t){V(n,t);var e=K(n);function n(t,r){var o;return G(this,n),(o=e.call(this,t,r)).itemClass=Q,o}return H(n,[{key:"getPlugin",value:function(){var t=arguments.length>0&&void 0!==arguments[0]?arguments[0]:3e4,e="plugin",n=Re;return this._getResource(e,n,null,t)}}]),n}(C);function tt(t){return tt="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(t){return typeof t}:function(t){return t&&"function"==typeof Symbol&&t.constructor===Symbol&&t!==Symbol.prototype?"symbol":typeof t},tt(t)}function et(t,e){if(!(t instanceof e))throw new TypeError("Cannot call a class as a function")}function nt(t,e){for(var n=0;n<e.length;n++){var r=e[n];r.enumerable=r.enumerable||!1,r.configurable=!0,"value"in r&&(r.writable=!0),Object.defineProperty(t,r.key,r)}}function rt(t,e,n){return e&&nt(t.prototype,e),n&&nt(t,n),Object.defineProperty(t,"prototype",{writable:!1}),t}function ot(t,e){if("function"!=typeof e&&null!==e)throw new TypeError("Super expression must either be null or a function");t.prototype=Object.create(e&&e.prototype,{constructor:{value:t,writable:!0,configurable:!0}}),Object.defineProperty(t,"prototype",{writable:!1}),e&&it(t,e)}function it(t,e){return it=Object.setPrototypeOf||function(t,e){return t.__proto__=e,t},it(t,e)}function ut(t){var e=function(){if("undefined"==typeof Reflect||!Reflect.construct)return!1;if(Reflect.construct.sham)return!1;if("function"==typeof Proxy)return!0;try{return Boolean.prototype.valueOf.call(Reflect.construct(Boolean,[],(function(){}))),!0}catch(t){return!1}}();return function(){var n,r=at(t);if(e){var o=at(this).constructor;n=Reflect.construct(r,arguments,o)}else n=r.apply(this,arguments);return ct(this,n)}}function ct(t,e){if(e&&("object"===tt(e)||"function"==typeof e))return e;if(void 0!==e)throw new TypeError("Derived constructors may only return object or undefined");return function(t){if(void 0===t)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return t}(t)}function at(t){return at=Object.setPrototypeOf?Object.getPrototypeOf:function(t){return t.__proto__||Object.getPrototypeOf(t)},at(t)}n(8674);var st=function(t){ot(n,t);var e=ut(n);function n(t,r){return et(this,n),e.call(this,t,r)}return rt(n,[{key:"getFileBlob",value:function(){var t=arguments.length>0&&void 0!==arguments[0]?arguments[0]:3e4;if(this.isEmpty)throw new y("Item object has not been set!");var e=new b(this.auth,"application/octet-stream",t),n=this.collection.items[0],r=u.getLinkRelationUrls(n,"file_resource")[0];return e.get(r).then((function(t){return t.data}))}},{key:"getPluginInstance",value:function(){var t=arguments.length>0&&void 0!==arguments[0]?arguments[0]:3e4,e="plugin_inst",n=Xt;return this._getResource(e,n,null,t)}}]),n}(T),lt=function(t){ot(n,t);var e=ut(n);function n(t,r){var o;return et(this,n),(o=e.call(this,t,r)).itemClass=st,o}return rt(n,[{key:"getFeed",value:function(){var t=arguments.length>0&&void 0!==arguments[0]?arguments[0]:3e4,e="feed",n=sr;return this._getResource(e,n,null,t)}}]),n}(C),ft=function(t){ot(n,t);var e=ut(n);function n(t,r){var o;return et(this,n),(o=e.call(this,t,r)).itemClass=st,o}return rt(n)}(C),pt=function(t){ot(n,t);var e=ut(n);function n(t,r){var o;return et(this,n),(o=e.call(this,t,r)).itemClass=st,o}return rt(n,[{key:"getFeed",value:function(){var t=arguments.length>0&&void 0!==arguments[0]?arguments[0]:3e4,e="feed",n=sr;return this._getResource(e,n,null,t)}},{key:"getPluginInstance",value:function(){var t=arguments.length>0&&void 0!==arguments[0]?arguments[0]:3e4,e="plugin_inst",n=Xt;return this._getResource(e,n,null,t)}}]),n}(C);function ht(t){return ht="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(t){return typeof t}:function(t){return t&&"function"==typeof Symbol&&t.constructor===Symbol&&t!==Symbol.prototype?"symbol":typeof t},ht(t)}function vt(t,e){if(!(t instanceof e))throw new TypeError("Cannot call a class as a function")}function yt(t,e){for(var n=0;n<e.length;n++){var r=e[n];r.enumerable=r.enumerable||!1,r.configurable=!0,"value"in r&&(r.writable=!0),Object.defineProperty(t,r.key,r)}}function dt(t,e,n){return e&&yt(t.prototype,e),n&&yt(t,n),Object.defineProperty(t,"prototype",{writable:!1}),t}function gt(t,e){if("function"!=typeof e&&null!==e)throw new TypeError("Super expression must either be null or a function");t.prototype=Object.create(e&&e.prototype,{constructor:{value:t,writable:!0,configurable:!0}}),Object.defineProperty(t,"prototype",{writable:!1}),e&&bt(t,e)}function bt(t,e){return bt=Object.setPrototypeOf||function(t,e){return t.__proto__=e,t},bt(t,e)}function mt(t){var e=function(){if("undefined"==typeof Reflect||!Reflect.construct)return!1;if(Reflect.construct.sham)return!1;if("function"==typeof Proxy)return!0;try{return Boolean.prototype.valueOf.call(Reflect.construct(Boolean,[],(function(){}))),!0}catch(t){return!1}}();return function(){var n,r=Ot(t);if(e){var o=Ot(this).constructor;n=Reflect.construct(r,arguments,o)}else n=r.apply(this,arguments);return wt(this,n)}}function wt(t,e){if(e&&("object"===ht(e)||"function"==typeof e))return e;if(void 0!==e)throw new TypeError("Derived constructors may only return object or undefined");return function(t){if(void 0===t)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return t}(t)}function Ot(t){return Ot=Object.setPrototypeOf?Object.getPrototypeOf:function(t){return t.__proto__||Object.getPrototypeOf(t)},Ot(t)}var Pt=function(t){gt(n,t);var e=mt(n);function n(t,r){return vt(this,n),e.call(this,t,r)}return dt(n,[{key:"getPlugins",value:function(){var t=arguments.length>0&&void 0!==arguments[0]?arguments[0]:null,e=arguments.length>1&&void 0!==arguments[1]?arguments[1]:3e4,n="plugins",r=Rt;return this._getResource(n,r,t,e)}},{key:"getPluginPipings",value:function(){var t=arguments.length>0&&void 0!==arguments[0]?arguments[0]:null,e=arguments.length>1&&void 0!==arguments[1]?arguments[1]:3e4,n="plugin_pipings",r=St;return this._getResource(n,r,t,e)}},{key:"getDefaultParameters",value:function(){var t=arguments.length>0&&void 0!==arguments[0]?arguments[0]:null,e=arguments.length>1&&void 0!==arguments[1]?arguments[1]:3e4,n="default_parameters",r=kt;return this._getResource(n,r,t,e)}},{key:"getPipelineInstances",value:function(){var t=arguments.length>0&&void 0!==arguments[0]?arguments[0]:null,e=arguments.length>1&&void 0!==arguments[1]?arguments[1]:3e4,n="instances",r=Dt;return this._getResource(n,r,t,e)}},{key:"put",value:function(t){var e=arguments.length>1&&void 0!==arguments[1]?arguments[1]:3e4;return this._put(t,null,e)}},{key:"delete",value:function(){var t=arguments.length>0&&void 0!==arguments[0]?arguments[0]:3e4;return this._delete(t)}}]),n}(T),_t=function(t){gt(n,t);var e=mt(n);function n(t,r){var o;return vt(this,n),(o=e.call(this,t,r)).itemClass=Pt,o}return dt(n,[{key:"getPlugins",value:function(){var t=arguments.length>0&&void 0!==arguments[0]?arguments[0]:null,e=arguments.length>1&&void 0!==arguments[1]?arguments[1]:3e4,n="plugins",r=Se;return this._getResource(n,r,t,e)}},{key:"post",value:function(t){var e=arguments.length>1&&void 0!==arguments[1]?arguments[1]:3e4;return this._post(t,null,e)}}]),n}(C),jt=function(t){gt(n,t);var e=mt(n);function n(t,r){return vt(this,n),e.call(this,t,r)}return dt(n,[{key:"getPreviousPluginPiping",value:function(){var t=arguments.length>0&&void 0!==arguments[0]?arguments[0]:3e4,e="previous",r=n;try{return this._getResource(e,r,null,t)}catch(t){return Promise.resolve(null)}}},{key:"getPlugin",value:function(){var t=arguments.length>0&&void 0!==arguments[0]?arguments[0]:3e4,e="plugin",n=Re;return this._getResource(e,n,null,t)}},{key:"getPipeline",value:function(){var t=arguments.length>0&&void 0!==arguments[0]?arguments[0]:3e4,e="pipeline",n=Pt;return this._getResource(e,n,null,t)}}]),n}(T),xt=function(t){gt(n,t);var e=mt(n);function n(t,r){return vt(this,n),e.call(this,t,r)}return dt(n,[{key:"getPluginPiping",value:function(){var t=arguments.length>0&&void 0!==arguments[0]?arguments[0]:3e4,e="plugin_piping",n=jt;return this._getResource(e,n,null,t)}},{key:"getPluginParameter",value:function(){var t=arguments.length>0&&void 0!==arguments[0]?arguments[0]:3e4,e="plugin_param",n=Q;return this._getResource(e,n,null,t)}}]),n}(T),Rt=function(t){gt(n,t);var e=mt(n);function n(t,r){var o;return vt(this,n),(o=e.call(this,t,r)).itemClass=Re,o}return dt(n)}(C),St=function(t){gt(n,t);var e=mt(n);function n(t,r){var o;return vt(this,n),(o=e.call(this,t,r)).itemClass=jt,o}return dt(n)}(C),kt=function(t){gt(n,t);var e=mt(n);function n(t,r){var o;return vt(this,n),(o=e.call(this,t,r)).itemClass=xt,o}return dt(n)}(C);function Et(t){return Et="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(t){return typeof t}:function(t){return t&&"function"==typeof Symbol&&t.constructor===Symbol&&t!==Symbol.prototype?"symbol":typeof t},Et(t)}function Tt(t,e){if(!(t instanceof e))throw new TypeError("Cannot call a class as a function")}function Ct(t,e){for(var n=0;n<e.length;n++){var r=e[n];r.enumerable=r.enumerable||!1,r.configurable=!0,"value"in r&&(r.writable=!0),Object.defineProperty(t,r.key,r)}}function It(t,e,n){return e&&Ct(t.prototype,e),n&&Ct(t,n),Object.defineProperty(t,"prototype",{writable:!1}),t}function Ut(t,e){if("function"!=typeof e&&null!==e)throw new TypeError("Super expression must either be null or a function");t.prototype=Object.create(e&&e.prototype,{constructor:{value:t,writable:!0,configurable:!0}}),Object.defineProperty(t,"prototype",{writable:!1}),e&&At(t,e)}function At(t,e){return At=Object.setPrototypeOf||function(t,e){return t.__proto__=e,t},At(t,e)}function Ft(t){var e=function(){if("undefined"==typeof Reflect||!Reflect.construct)return!1;if(Reflect.construct.sham)return!1;if("function"==typeof Proxy)return!0;try{return Boolean.prototype.valueOf.call(Reflect.construct(Boolean,[],(function(){}))),!0}catch(t){return!1}}();return function(){var n,r=Bt(t);if(e){var o=Bt(this).constructor;n=Reflect.construct(r,arguments,o)}else n=r.apply(this,arguments);return Lt(this,n)}}function Lt(t,e){if(e&&("object"===Et(e)||"function"==typeof e))return e;if(void 0!==e)throw new TypeError("Derived constructors may only return object or undefined");return function(t){if(void 0===t)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return t}(t)}function Bt(t){return Bt=Object.setPrototypeOf?Object.getPrototypeOf:function(t){return t.__proto__||Object.getPrototypeOf(t)},Bt(t)}var Nt=function(t){Ut(n,t);var e=Ft(n);function n(t,r){return Tt(this,n),e.call(this,t,r)}return It(n,[{key:"getPipeline",value:function(){var t=arguments.length>0&&void 0!==arguments[0]?arguments[0]:3e4,e="pipeline",n=Pt;return this._getResource(e,n,null,t)}},{key:"getPluginInstances",value:function(){var t=arguments.length>0&&void 0!==arguments[0]?arguments[0]:null,e=arguments.length>1&&void 0!==arguments[1]?arguments[1]:3e4,n="plugin_instances",r=te;return this._getResource(n,r,t,e)}},{key:"put",value:function(t){var e=arguments.length>1&&void 0!==arguments[1]?arguments[1]:3e4;return this._put(t,null,e)}},{key:"delete",value:function(){var t=arguments.length>0&&void 0!==arguments[0]?arguments[0]:3e4;return this._delete(t)}}]),n}(T),Dt=function(t){Ut(n,t);var e=Ft(n);function n(t,r){var o;return Tt(this,n),(o=e.call(this,t,r)).itemClass=Nt,o}return It(n,[{key:"post",value:function(t){var e=arguments.length>1&&void 0!==arguments[1]?arguments[1]:3e4;return this._post(t,null,e)}}]),n}(C),Mt=function(t){Ut(n,t);var e=Ft(n);function n(t,r){var o;return Tt(this,n),(o=e.call(this,t,r)).itemClass=Nt,o}return It(n,[{key:"getPipelines",value:function(){var t=arguments.length>0&&void 0!==arguments[0]?arguments[0]:null,e=arguments.length>1&&void 0!==arguments[1]?arguments[1]:3e4,n="pipelines",r=_t;return this._getResource(n,r,t,e)}}]),n}(C);function qt(t){return qt="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(t){return typeof t}:function(t){return t&&"function"==typeof Symbol&&t.constructor===Symbol&&t!==Symbol.prototype?"symbol":typeof t},qt(t)}function zt(t,e){if(!(t instanceof e))throw new TypeError("Cannot call a class as a function")}function Wt(t,e){for(var n=0;n<e.length;n++){var r=e[n];r.enumerable=r.enumerable||!1,r.configurable=!0,"value"in r&&(r.writable=!0),Object.defineProperty(t,r.key,r)}}function Gt(t,e,n){return e&&Wt(t.prototype,e),n&&Wt(t,n),Object.defineProperty(t,"prototype",{writable:!1}),t}function Jt(t,e){if("function"!=typeof e&&null!==e)throw new TypeError("Super expression must either be null or a function");t.prototype=Object.create(e&&e.prototype,{constructor:{value:t,writable:!0,configurable:!0}}),Object.defineProperty(t,"prototype",{writable:!1}),e&&Ht(t,e)}function Ht(t,e){return Ht=Object.setPrototypeOf||function(t,e){return t.__proto__=e,t},Ht(t,e)}function Vt(t){var e=function(){if("undefined"==typeof Reflect||!Reflect.construct)return!1;if(Reflect.construct.sham)return!1;if("function"==typeof Proxy)return!0;try{return Boolean.prototype.valueOf.call(Reflect.construct(Boolean,[],(function(){}))),!0}catch(t){return!1}}();return function(){var n,r=Kt(t);if(e){var o=Kt(this).constructor;n=Reflect.construct(r,arguments,o)}else n=r.apply(this,arguments);return $t(this,n)}}function $t(t,e){if(e&&("object"===qt(e)||"function"==typeof e))return e;if(void 0!==e)throw new TypeError("Derived constructors may only return object or undefined");return function(t){if(void 0===t)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return t}(t)}function Kt(t){return Kt=Object.setPrototypeOf?Object.getPrototypeOf:function(t){return t.__proto__||Object.getPrototypeOf(t)},Kt(t)}var Xt=function(t){Jt(n,t);var e=Vt(n);function n(t,r){return zt(this,n),e.call(this,t,r)}return Gt(n,[{key:"getFeed",value:function(){var t=arguments.length>0&&void 0!==arguments[0]?arguments[0]:3e4,e="feed",n=sr;try{return this._getResource(e,n,null,t)}catch(t){return Promise.resolve(null)}}},{key:"getPlugin",value:function(){var t=arguments.length>0&&void 0!==arguments[0]?arguments[0]:3e4,e="plugin",n=Re;return this._getResource(e,n,null,t)}},{key:"getComputeResource",value:function(){var t=arguments.length>0&&void 0!==arguments[0]?arguments[0]:3e4,e="compute_resource",n=Ne;return this._getResource(e,n,null,t)}},{key:"getPreviousPluginInstance",value:function(){var t=arguments.length>0&&void 0!==arguments[0]?arguments[0]:3e4,e="previous",r=n;try{return this._getResource(e,r,null,t)}catch(t){return Promise.resolve(null)}}},{key:"getPipelineInstance",value:function(){var t=arguments.length>0&&void 0!==arguments[0]?arguments[0]:3e4,e="pipeline_inst",n=Nt;try{return this._getResource(e,n,null,t)}catch(t){return Promise.resolve(null)}}},{key:"getDescendantPluginInstances",value:function(){var t=arguments.length>0&&void 0!==arguments[0]?arguments[0]:null,e=arguments.length>1&&void 0!==arguments[1]?arguments[1]:3e4,n="descendants",r=ee;return this._getResource(n,r,t,e)}},{key:"getParameters",value:function(){var t=arguments.length>0&&void 0!==arguments[0]?arguments[0]:null,e=arguments.length>1&&void 0!==arguments[1]?arguments[1]:3e4,n="parameters",r=ie;return this._getResource(n,r,t,e)}},{key:"getFiles",value:function(){var t=arguments.length>0&&void 0!==arguments[0]?arguments[0]:null,e=arguments.length>1&&void 0!==arguments[1]?arguments[1]:3e4,n="files",r=pt;return this._getResource(n,r,t,e)}},{key:"getSplits",value:function(){var t=arguments.length>0&&void 0!==arguments[0]?arguments[0]:null,e=arguments.length>1&&void 0!==arguments[1]?arguments[1]:3e4,n="splits",r=re;return this._getResource(n,r,t,e)}},{key:"put",value:function(t){var e=arguments.length>1&&void 0!==arguments[1]?arguments[1]:3e4;return this._put(t,null,e)}},{key:"delete",value:function(){var t=arguments.length>0&&void 0!==arguments[0]?arguments[0]:3e4;return this._delete(t)}}]),n}(T),Yt=function(t){Jt(n,t);var e=Vt(n);function n(t,r){var o;return zt(this,n),(o=e.call(this,t,r)).itemClass=Xt,o}return Gt(n,[{key:"getPlugin",value:function(){var t=arguments.length>0&&void 0!==arguments[0]?arguments[0]:3e4,e="plugin",n=Re;return this._getResource(e,n,null,t)}},{key:"post",value:function(t){var e=arguments.length>1&&void 0!==arguments[1]?arguments[1]:3e4;return this._post(t,null,e)}}]),n}(C),Qt=function(t){Jt(n,t);var e=Vt(n);function n(t,r){var o;return zt(this,n),(o=e.call(this,t,r)).itemClass=Xt,o}return Gt(n,[{key:"getPlugins",value:function(){var t=arguments.length>0&&void 0!==arguments[0]?arguments[0]:null,e=arguments.length>1&&void 0!==arguments[1]?arguments[1]:3e4,n="plugins",r=Se;return this._getResource(n,r,t,e)}}]),n}(C),Zt=function(t){Jt(n,t);var e=Vt(n);function n(t,r){var o;return zt(this,n),(o=e.call(this,t,r)).itemClass=Xt,o}return Gt(n,[{key:"getFeed",value:function(){var t=arguments.length>0&&void 0!==arguments[0]?arguments[0]:3e4,e="feed",n=sr;return this._getResource(e,n,null,t)}}]),n}(C),te=function(t){Jt(n,t);var e=Vt(n);function n(t,r){var o;return zt(this,n),(o=e.call(this,t,r)).itemClass=Xt,o}return Gt(n)}(C),ee=function(t){Jt(n,t);var e=Vt(n);function n(t,r){var o;return zt(this,n),(o=e.call(this,t,r)).itemClass=Xt,o}return Gt(n)}(C),ne=function(t){Jt(n,t);var e=Vt(n);function n(t,r){return zt(this,n),e.call(this,t,r)}return Gt(n,[{key:"getPluginInstance",value:function(){var t=arguments.length>0&&void 0!==arguments[0]?arguments[0]:3e4,e="plugin_inst",n=Xt;return this._getResource(e,n,null,t)}}]),n}(T),re=function(t){Jt(n,t);var e=Vt(n);function n(t,r){var o;return zt(this,n),(o=e.call(this,t,r)).itemClass=ne,o}return Gt(n,[{key:"getPluginInstance",value:function(){var t=arguments.length>0&&void 0!==arguments[0]?arguments[0]:3e4,e="plugin_inst",n=Xt;return this._getResource(e,n,null,t)}},{key:"post",value:function(t){var e=arguments.length>1&&void 0!==arguments[1]?arguments[1]:3e4;return this._post(t,null,e)}}]),n}(C),oe=function(t){Jt(n,t);var e=Vt(n);function n(t,r){return zt(this,n),e.call(this,t,r)}return Gt(n,[{key:"getPluginInstance",value:function(){var t=arguments.length>0&&void 0!==arguments[0]?arguments[0]:3e4,e="plugin_inst",n=Xt;return this._getResource(e,n,null,t)}},{key:"getPluginParameter",value:function(){var t=arguments.length>0&&void 0!==arguments[0]?arguments[0]:3e4,e="plugin_param",n=Q;return this._getResource(e,n,null,t)}}]),n}(T),ie=function(t){Jt(n,t);var e=Vt(n);function n(t,r){var o;return zt(this,n),(o=e.call(this,t,r)).itemClass=oe,o}return Gt(n)}(C);function ue(t){return ue="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(t){return typeof t}:function(t){return t&&"function"==typeof Symbol&&t.constructor===Symbol&&t!==Symbol.prototype?"symbol":typeof t},ue(t)}function ce(t,e){if(!(t instanceof e))throw new TypeError("Cannot call a class as a function")}function ae(t,e){for(var n=0;n<e.length;n++){var r=e[n];r.enumerable=r.enumerable||!1,r.configurable=!0,"value"in r&&(r.writable=!0),Object.defineProperty(t,r.key,r)}}function se(t,e,n){return e&&ae(t.prototype,e),n&&ae(t,n),Object.defineProperty(t,"prototype",{writable:!1}),t}function le(t,e){if("function"!=typeof e&&null!==e)throw new TypeError("Super expression must either be null or a function");t.prototype=Object.create(e&&e.prototype,{constructor:{value:t,writable:!0,configurable:!0}}),Object.defineProperty(t,"prototype",{writable:!1}),e&&fe(t,e)}function fe(t,e){return fe=Object.setPrototypeOf||function(t,e){return t.__proto__=e,t},fe(t,e)}function pe(t){var e=function(){if("undefined"==typeof Reflect||!Reflect.construct)return!1;if(Reflect.construct.sham)return!1;if("function"==typeof Proxy)return!0;try{return Boolean.prototype.valueOf.call(Reflect.construct(Boolean,[],(function(){}))),!0}catch(t){return!1}}();return function(){var n,r=ve(t);if(e){var o=ve(this).constructor;n=Reflect.construct(r,arguments,o)}else n=r.apply(this,arguments);return he(this,n)}}function he(t,e){if(e&&("object"===ue(e)||"function"==typeof e))return e;if(void 0!==e)throw new TypeError("Derived constructors may only return object or undefined");return function(t){if(void 0===t)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return t}(t)}function ve(t){return ve=Object.setPrototypeOf?Object.getPrototypeOf:function(t){return t.__proto__||Object.getPrototypeOf(t)},ve(t)}var ye=function(t){le(n,t);var e=pe(n);function n(t){var r=arguments.length>1&&void 0!==arguments[1]?arguments[1]:null;return ce(this,n),e.call(this,t,r)}return se(n,[{key:"getPlugins",value:function(){var t=arguments.length>0&&void 0!==arguments[0]?arguments[0]:null,e=arguments.length>1&&void 0!==arguments[1]?arguments[1]:3e4,n="plugins",r=ke;return this._getResource(n,r,t,e)}}]),n}(T),de=function(t){le(n,t);var e=pe(n);function n(t){var r,o=arguments.length>1&&void 0!==arguments[1]?arguments[1]:null;return ce(this,n),(r=e.call(this,t,o)).itemClass=ye,r}return se(n,[{key:"getPlugins",value:function(){var t=arguments.length>0&&void 0!==arguments[0]?arguments[0]:null,e=arguments.length>1&&void 0!==arguments[1]?arguments[1]:3e4,n="plugins",r=Se;return this._getResource(n,r,t,e)}},{key:"getFeeds",value:function(){var t=arguments.length>0&&void 0!==arguments[0]?arguments[0]:null,e=arguments.length>1&&void 0!==arguments[1]?arguments[1]:3e4,n="feeds",r=lr;return this._getResource(n,r,t,e)}}]),n}(C);function ge(t){return ge="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(t){return typeof t}:function(t){return t&&"function"==typeof Symbol&&t.constructor===Symbol&&t!==Symbol.prototype?"symbol":typeof t},ge(t)}function be(t,e){if(!(t instanceof e))throw new TypeError("Cannot call a class as a function")}function me(t,e){for(var n=0;n<e.length;n++){var r=e[n];r.enumerable=r.enumerable||!1,r.configurable=!0,"value"in r&&(r.writable=!0),Object.defineProperty(t,r.key,r)}}function we(t,e,n){return e&&me(t.prototype,e),n&&me(t,n),Object.defineProperty(t,"prototype",{writable:!1}),t}function Oe(t,e){if("function"!=typeof e&&null!==e)throw new TypeError("Super expression must either be null or a function");t.prototype=Object.create(e&&e.prototype,{constructor:{value:t,writable:!0,configurable:!0}}),Object.defineProperty(t,"prototype",{writable:!1}),e&&Pe(t,e)}function Pe(t,e){return Pe=Object.setPrototypeOf||function(t,e){return t.__proto__=e,t},Pe(t,e)}function _e(t){var e=function(){if("undefined"==typeof Reflect||!Reflect.construct)return!1;if(Reflect.construct.sham)return!1;if("function"==typeof Proxy)return!0;try{return Boolean.prototype.valueOf.call(Reflect.construct(Boolean,[],(function(){}))),!0}catch(t){return!1}}();return function(){var n,r=xe(t);if(e){var o=xe(this).constructor;n=Reflect.construct(r,arguments,o)}else n=r.apply(this,arguments);return je(this,n)}}function je(t,e){if(e&&("object"===ge(e)||"function"==typeof e))return e;if(void 0!==e)throw new TypeError("Derived constructors may only return object or undefined");return function(t){if(void 0===t)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return t}(t)}function xe(t){return xe=Object.setPrototypeOf?Object.getPrototypeOf:function(t){return t.__proto__||Object.getPrototypeOf(t)},xe(t)}var Re=function(t){Oe(n,t);var e=_e(n);function n(t,r){return be(this,n),e.call(this,t,r)}return we(n,[{key:"getPluginParameters",value:function(){var t=arguments.length>0&&void 0!==arguments[0]?arguments[0]:null,e=arguments.length>1&&void 0!==arguments[1]?arguments[1]:3e4,n="parameters",r=Z;return this._getResource(n,r,t,e)}},{key:"getPluginComputeResources",value:function(){var t=arguments.length>0&&void 0!==arguments[0]?arguments[0]:null,e=arguments.length>1&&void 0!==arguments[1]?arguments[1]:3e4,n="compute_resources",r=Me;return this._getResource(n,r,t,e)}},{key:"getPluginInstances",value:function(){var t=arguments.length>0&&void 0!==arguments[0]?arguments[0]:null,e=arguments.length>1&&void 0!==arguments[1]?arguments[1]:3e4,n="instances",r=Yt;return this._getResource(n,r,t,e)}}]),n}(T),Se=function(t){Oe(n,t);var e=_e(n);function n(t,r){var o;return be(this,n),(o=e.call(this,t,r)).itemClass=Re,o}return we(n,[{key:"getFeeds",value:function(){var t=arguments.length>0&&void 0!==arguments[0]?arguments[0]:null,e=arguments.length>1&&void 0!==arguments[1]?arguments[1]:3e4,n="feeds",r=lr;return this._getResource(n,r,t,e)}}]),n}(C),ke=function(t){Oe(n,t);var e=_e(n);function n(t){var r,o=arguments.length>1&&void 0!==arguments[1]?arguments[1]:null;return be(this,n),(r=e.call(this,t,o)).itemClass=Re,r}return we(n,[{key:"getPluginMeta",value:function(){var t=arguments.length>0&&void 0!==arguments[0]?arguments[0]:3e4,e="meta",n=ye;return this._getResource(e,n,null,t)}}]),n}(C);function Ee(t){return Ee="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(t){return typeof t}:function(t){return t&&"function"==typeof Symbol&&t.constructor===Symbol&&t!==Symbol.prototype?"symbol":typeof t},Ee(t)}function Te(t,e){for(var n=0;n<e.length;n++){var r=e[n];r.enumerable=r.enumerable||!1,r.configurable=!0,"value"in r&&(r.writable=!0),Object.defineProperty(t,r.key,r)}}function Ce(t,e,n){return e&&Te(t.prototype,e),n&&Te(t,n),Object.defineProperty(t,"prototype",{writable:!1}),t}function Ie(t,e){if(!(t instanceof e))throw new TypeError("Cannot call a class as a function")}function Ue(t,e){if("function"!=typeof e&&null!==e)throw new TypeError("Super expression must either be null or a function");t.prototype=Object.create(e&&e.prototype,{constructor:{value:t,writable:!0,configurable:!0}}),Object.defineProperty(t,"prototype",{writable:!1}),e&&Ae(t,e)}function Ae(t,e){return Ae=Object.setPrototypeOf||function(t,e){return t.__proto__=e,t},Ae(t,e)}function Fe(t){var e=function(){if("undefined"==typeof Reflect||!Reflect.construct)return!1;if(Reflect.construct.sham)return!1;if("function"==typeof Proxy)return!0;try{return Boolean.prototype.valueOf.call(Reflect.construct(Boolean,[],(function(){}))),!0}catch(t){return!1}}();return function(){var n,r=Be(t);if(e){var o=Be(this).constructor;n=Reflect.construct(r,arguments,o)}else n=r.apply(this,arguments);return Le(this,n)}}function Le(t,e){if(e&&("object"===Ee(e)||"function"==typeof e))return e;if(void 0!==e)throw new TypeError("Derived constructors may only return object or undefined");return function(t){if(void 0===t)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return t}(t)}function Be(t){return Be=Object.setPrototypeOf?Object.getPrototypeOf:function(t){return t.__proto__||Object.getPrototypeOf(t)},Be(t)}var Ne=function(t){Ue(n,t);var e=Fe(n);function n(t,r){return Ie(this,n),e.call(this,t,r)}return Ce(n)}(T),De=function(t){Ue(n,t);var e=Fe(n);function n(t,r){var o;return Ie(this,n),(o=e.call(this,t,r)).itemClass=Ne,o}return Ce(n,[{key:"getFeeds",value:function(){var t=arguments.length>0&&void 0!==arguments[0]?arguments[0]:null,e=arguments.length>1&&void 0!==arguments[1]?arguments[1]:3e4,n="feeds",r=lr;return this._getResource(n,r,t,e)}}]),n}(C),Me=function(t){Ue(n,t);var e=Fe(n);function n(t,r){var o;return Ie(this,n),(o=e.call(this,t,r)).itemClass=Ne,o}return Ce(n,[{key:"getPlugin",value:function(){var t=arguments.length>0&&void 0!==arguments[0]?arguments[0]:3e4,e="plugin",n=Re;return this._getResource(e,n,null,t)}}]),n}(C);function qe(t){return qe="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(t){return typeof t}:function(t){return t&&"function"==typeof Symbol&&t.constructor===Symbol&&t!==Symbol.prototype?"symbol":typeof t},qe(t)}function ze(t,e){if(!(t instanceof e))throw new TypeError("Cannot call a class as a function")}function We(t,e){for(var n=0;n<e.length;n++){var r=e[n];r.enumerable=r.enumerable||!1,r.configurable=!0,"value"in r&&(r.writable=!0),Object.defineProperty(t,r.key,r)}}function Ge(t,e,n){return e&&We(t.prototype,e),n&&We(t,n),Object.defineProperty(t,"prototype",{writable:!1}),t}function Je(t,e){if("function"!=typeof e&&null!==e)throw new TypeError("Super expression must either be null or a function");t.prototype=Object.create(e&&e.prototype,{constructor:{value:t,writable:!0,configurable:!0}}),Object.defineProperty(t,"prototype",{writable:!1}),e&&He(t,e)}function He(t,e){return He=Object.setPrototypeOf||function(t,e){return t.__proto__=e,t},He(t,e)}function Ve(t){var e=function(){if("undefined"==typeof Reflect||!Reflect.construct)return!1;if(Reflect.construct.sham)return!1;if("function"==typeof Proxy)return!0;try{return Boolean.prototype.valueOf.call(Reflect.construct(Boolean,[],(function(){}))),!0}catch(t){return!1}}();return function(){var n,r=Ke(t);if(e){var o=Ke(this).constructor;n=Reflect.construct(r,arguments,o)}else n=r.apply(this,arguments);return $e(this,n)}}function $e(t,e){if(e&&("object"===qe(e)||"function"==typeof e))return e;if(void 0!==e)throw new TypeError("Derived constructors may only return object or undefined");return function(t){if(void 0===t)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return t}(t)}function Ke(t){return Ke=Object.setPrototypeOf?Object.getPrototypeOf:function(t){return t.__proto__||Object.getPrototypeOf(t)},Ke(t)}var Xe=function(t){Je(n,t);var e=Ve(n);function n(t,r){return ze(this,n),e.call(this,t,r)}return Ge(n,[{key:"getFileBlob",value:function(){var t=arguments.length>0&&void 0!==arguments[0]?arguments[0]:3e4;if(this.isEmpty)throw new y("Item object has not been set!");var e=new b(this.auth,"application/octet-stream",t),n=this.collection.items[0],r=u.getLinkRelationUrls(n,"file_resource")[0];return e.get(r).then((function(t){return t.data}))}},{key:"put",value:function(t){var e=arguments.length>1&&void 0!==arguments[1]?arguments[1]:3e4;return this._put(t,null,e)}},{key:"delete",value:function(){var t=arguments.length>0&&void 0!==arguments[0]?arguments[0]:3e4;return this._delete(t)}}]),n}(T),Ye=function(t){Je(n,t);var e=Ve(n);function n(t,r){var o;return ze(this,n),(o=e.call(this,t,r)).itemClass=Xe,o}return Ge(n,[{key:"post",value:function(t,e){var n=arguments.length>2&&void 0!==arguments[2]?arguments[2]:3e4;return this._post(t,e,n)}}]),n}(C);function Qe(t){return Qe="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(t){return typeof t}:function(t){return t&&"function"==typeof Symbol&&t.constructor===Symbol&&t!==Symbol.prototype?"symbol":typeof t},Qe(t)}function Ze(t,e){if(!(t instanceof e))throw new TypeError("Cannot call a class as a function")}function tn(t,e){for(var n=0;n<e.length;n++){var r=e[n];r.enumerable=r.enumerable||!1,r.configurable=!0,"value"in r&&(r.writable=!0),Object.defineProperty(t,r.key,r)}}function en(t,e,n){return e&&tn(t.prototype,e),n&&tn(t,n),Object.defineProperty(t,"prototype",{writable:!1}),t}function nn(t,e){if("function"!=typeof e&&null!==e)throw new TypeError("Super expression must either be null or a function");t.prototype=Object.create(e&&e.prototype,{constructor:{value:t,writable:!0,configurable:!0}}),Object.defineProperty(t,"prototype",{writable:!1}),e&&rn(t,e)}function rn(t,e){return rn=Object.setPrototypeOf||function(t,e){return t.__proto__=e,t},rn(t,e)}function on(t){var e=function(){if("undefined"==typeof Reflect||!Reflect.construct)return!1;if(Reflect.construct.sham)return!1;if("function"==typeof Proxy)return!0;try{return Boolean.prototype.valueOf.call(Reflect.construct(Boolean,[],(function(){}))),!0}catch(t){return!1}}();return function(){var n,r=cn(t);if(e){var o=cn(this).constructor;n=Reflect.construct(r,arguments,o)}else n=r.apply(this,arguments);return un(this,n)}}function un(t,e){if(e&&("object"===Qe(e)||"function"==typeof e))return e;if(void 0!==e)throw new TypeError("Derived constructors may only return object or undefined");return function(t){if(void 0===t)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return t}(t)}function cn(t){return cn=Object.setPrototypeOf?Object.getPrototypeOf:function(t){return t.__proto__||Object.getPrototypeOf(t)},cn(t)}var an=function(t){nn(n,t);var e=on(n);function n(t,r){return Ze(this,n),e.call(this,t,r)}return en(n,[{key:"getFileBlob",value:function(){var t=arguments.length>0&&void 0!==arguments[0]?arguments[0]:3e4;if(this.isEmpty)throw new y("Item object has not been set!");var e=new b(this.auth,"application/octet-stream",t),n=this.collection.items[0],r=u.getLinkRelationUrls(n,"file_resource")[0];return e.get(r).then((function(t){return t.data}))}}]),n}(T),sn=function(t){nn(n,t);var e=on(n);function n(t,r){var o;return Ze(this,n),(o=e.call(this,t,r)).itemClass=an,o}return en(n)}(C);function ln(t){return ln="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(t){return typeof t}:function(t){return t&&"function"==typeof Symbol&&t.constructor===Symbol&&t!==Symbol.prototype?"symbol":typeof t},ln(t)}function fn(t,e){if(!(t instanceof e))throw new TypeError("Cannot call a class as a function")}function pn(t,e){for(var n=0;n<e.length;n++){var r=e[n];r.enumerable=r.enumerable||!1,r.configurable=!0,"value"in r&&(r.writable=!0),Object.defineProperty(t,r.key,r)}}function hn(t,e,n){return e&&pn(t.prototype,e),n&&pn(t,n),Object.defineProperty(t,"prototype",{writable:!1}),t}function vn(t,e){if("function"!=typeof e&&null!==e)throw new TypeError("Super expression must either be null or a function");t.prototype=Object.create(e&&e.prototype,{constructor:{value:t,writable:!0,configurable:!0}}),Object.defineProperty(t,"prototype",{writable:!1}),e&&yn(t,e)}function yn(t,e){return yn=Object.setPrototypeOf||function(t,e){return t.__proto__=e,t},yn(t,e)}function dn(t){var e=function(){if("undefined"==typeof Reflect||!Reflect.construct)return!1;if(Reflect.construct.sham)return!1;if("function"==typeof Proxy)return!0;try{return Boolean.prototype.valueOf.call(Reflect.construct(Boolean,[],(function(){}))),!0}catch(t){return!1}}();return function(){var n,r=bn(t);if(e){var o=bn(this).constructor;n=Reflect.construct(r,arguments,o)}else n=r.apply(this,arguments);return gn(this,n)}}function gn(t,e){if(e&&("object"===ln(e)||"function"==typeof e))return e;if(void 0!==e)throw new TypeError("Derived constructors may only return object or undefined");return function(t){if(void 0===t)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return t}(t)}function bn(t){return bn=Object.setPrototypeOf?Object.getPrototypeOf:function(t){return t.__proto__||Object.getPrototypeOf(t)},bn(t)}var mn=function(t){vn(n,t);var e=dn(n);function n(t,r){return fn(this,n),e.call(this,t,r)}return hn(n,[{key:"getFileBlob",value:function(){var t=arguments.length>0&&void 0!==arguments[0]?arguments[0]:3e4;if(this.isEmpty)throw new y("Item object has not been set!");var e=new b(this.auth,"application/octet-stream",t),n=this.collection.items[0],r=u.getLinkRelationUrls(n,"file_resource")[0];return e.get(r).then((function(t){return t.data}))}}]),n}(T),wn=function(t){vn(n,t);var e=dn(n);function n(t,r){var o;return fn(this,n),(o=e.call(this,t,r)).itemClass=mn,o}return hn(n)}(C);function On(t){return On="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(t){return typeof t}:function(t){return t&&"function"==typeof Symbol&&t.constructor===Symbol&&t!==Symbol.prototype?"symbol":typeof t},On(t)}function Pn(t,e){for(var n=0;n<e.length;n++){var r=e[n];r.enumerable=r.enumerable||!1,r.configurable=!0,"value"in r&&(r.writable=!0),Object.defineProperty(t,r.key,r)}}function _n(t,e){return _n=Object.setPrototypeOf||function(t,e){return t.__proto__=e,t},_n(t,e)}function jn(t,e){if(e&&("object"===On(e)||"function"==typeof e))return e;if(void 0!==e)throw new TypeError("Derived constructors may only return object or undefined");return function(t){if(void 0===t)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return t}(t)}function xn(t){return xn=Object.setPrototypeOf?Object.getPrototypeOf:function(t){return t.__proto__||Object.getPrototypeOf(t)},xn(t)}var Rn=function(t){!function(t,e){if("function"!=typeof e&&null!==e)throw new TypeError("Super expression must either be null or a function");t.prototype=Object.create(e&&e.prototype,{constructor:{value:t,writable:!0,configurable:!0}}),Object.defineProperty(t,"prototype",{writable:!1}),e&&_n(t,e)}(u,t);var e,n,r,o,i=(r=u,o=function(){if("undefined"==typeof Reflect||!Reflect.construct)return!1;if(Reflect.construct.sham)return!1;if("function"==typeof Proxy)return!0;try{return Boolean.prototype.valueOf.call(Reflect.construct(Boolean,[],(function(){}))),!0}catch(t){return!1}}(),function(){var t,e=xn(r);if(o){var n=xn(this).constructor;t=Reflect.construct(e,arguments,n)}else t=e.apply(this,arguments);return jn(this,t)});function u(t,e){return function(t,e){if(!(t instanceof e))throw new TypeError("Cannot call a class as a function")}(this,u),i.call(this,t,e)}return e=u,n=[{key:"put",value:function(t){var e=arguments.length>1&&void 0!==arguments[1]?arguments[1]:3e4;return this._put(t,null,e)}}],n&&Pn(e.prototype,n),Object.defineProperty(e,"prototype",{writable:!1}),u}(T);function Sn(t){return Sn="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(t){return typeof t}:function(t){return t&&"function"==typeof Symbol&&t.constructor===Symbol&&t!==Symbol.prototype?"symbol":typeof t},Sn(t)}function kn(t,e){if(!(t instanceof e))throw new TypeError("Cannot call a class as a function")}function En(t,e){for(var n=0;n<e.length;n++){var r=e[n];r.enumerable=r.enumerable||!1,r.configurable=!0,"value"in r&&(r.writable=!0),Object.defineProperty(t,r.key,r)}}function Tn(t,e,n){return e&&En(t.prototype,e),n&&En(t,n),Object.defineProperty(t,"prototype",{writable:!1}),t}function Cn(t,e){if("function"!=typeof e&&null!==e)throw new TypeError("Super expression must either be null or a function");t.prototype=Object.create(e&&e.prototype,{constructor:{value:t,writable:!0,configurable:!0}}),Object.defineProperty(t,"prototype",{writable:!1}),e&&In(t,e)}function In(t,e){return In=Object.setPrototypeOf||function(t,e){return t.__proto__=e,t},In(t,e)}function Un(t){var e=function(){if("undefined"==typeof Reflect||!Reflect.construct)return!1;if(Reflect.construct.sham)return!1;if("function"==typeof Proxy)return!0;try{return Boolean.prototype.valueOf.call(Reflect.construct(Boolean,[],(function(){}))),!0}catch(t){return!1}}();return function(){var n,r=Fn(t);if(e){var o=Fn(this).constructor;n=Reflect.construct(r,arguments,o)}else n=r.apply(this,arguments);return An(this,n)}}function An(t,e){if(e&&("object"===Sn(e)||"function"==typeof e))return e;if(void 0!==e)throw new TypeError("Derived constructors may only return object or undefined");return function(t){if(void 0===t)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return t}(t)}function Fn(t){return Fn=Object.setPrototypeOf?Object.getPrototypeOf:function(t){return t.__proto__||Object.getPrototypeOf(t)},Fn(t)}var Ln=function(t){Cn(n,t);var e=Un(n);function n(t,r){return kn(this,n),e.call(this,t,r)}return Tn(n,[{key:"getTaggedFeeds",value:function(){var t=arguments.length>0&&void 0!==arguments[0]?arguments[0]:null,e=arguments.length>1&&void 0!==arguments[1]?arguments[1]:3e4,n="feeds",r=qn;return this._getResource(n,r,t,e)}},{key:"getTaggings",value:function(){var t=arguments.length>0&&void 0!==arguments[0]?arguments[0]:null,e=arguments.length>1&&void 0!==arguments[1]?arguments[1]:3e4,n="taggings",r=Dn;return this._getResource(n,r,t,e)}},{key:"put",value:function(t){var e=arguments.length>1&&void 0!==arguments[1]?arguments[1]:3e4;return this._put(t,null,e)}},{key:"delete",value:function(){var t=arguments.length>0&&void 0!==arguments[0]?arguments[0]:3e4;return this._delete(t)}}]),n}(T),Bn=function(t){Cn(n,t);var e=Un(n);function n(t,r){var o;return kn(this,n),(o=e.call(this,t,r)).itemClass=Ln,o}return Tn(n,[{key:"getFeeds",value:function(){var t=arguments.length>0&&void 0!==arguments[0]?arguments[0]:null,e=arguments.length>1&&void 0!==arguments[1]?arguments[1]:3e4,n="feeds",r=lr;return this._getResource(n,r,t,e)}},{key:"post",value:function(t){var e=arguments.length>1&&void 0!==arguments[1]?arguments[1]:3e4;return this._post(t,null,e)}}]),n}(C),Nn=function(t){Cn(n,t);var e=Un(n);function n(t,r){return kn(this,n),e.call(this,t,r)}return Tn(n,[{key:"getTag",value:function(){var t=arguments.length>0&&void 0!==arguments[0]?arguments[0]:3e4,e="tag",n=Ln;return this._getResource(e,n,null,t)}},{key:"getFeed",value:function(){var t=arguments.length>0&&void 0!==arguments[0]?arguments[0]:3e4,e="feed",n=sr;return this._getResource(e,n,null,t)}},{key:"delete",value:function(){var t=arguments.length>0&&void 0!==arguments[0]?arguments[0]:3e4;return this._delete(t)}}]),n}(T),Dn=function(t){Cn(n,t);var e=Un(n);function n(t,r){var o;return kn(this,n),(o=e.call(this,t,r)).itemClass=Nn,o}return Tn(n,[{key:"getTag",value:function(){var t=arguments.length>0&&void 0!==arguments[0]?arguments[0]:3e4,e="tag",n=Ln;return this._getResource(e,n,null,t)}},{key:"post",value:function(t){var e=arguments.length>1&&void 0!==arguments[1]?arguments[1]:3e4;return this._post(t,null,e)}}]),n}(C),Mn=function(t){Cn(n,t);var e=Un(n);function n(t,r){var o;return kn(this,n),(o=e.call(this,t,r)).itemClass=Nn,o}return Tn(n,[{key:"getFeed",value:function(){var t=arguments.length>0&&void 0!==arguments[0]?arguments[0]:3e4,e="feed",n=sr;return this._getResource(e,n,null,t)}},{key:"post",value:function(t){var e=arguments.length>1&&void 0!==arguments[1]?arguments[1]:3e4;return this._post(t,null,e)}}]),n}(C),qn=function(t){Cn(n,t);var e=Un(n);function n(t,r){var o;return kn(this,n),(o=e.call(this,t,r)).itemClass=sr,o}return Tn(n,[{key:"getTag",value:function(){var t=arguments.length>0&&void 0!==arguments[0]?arguments[0]:3e4,e="tag",n=Ln;return this._getResource(e,n,null,t)}}]),n}(C),zn=function(t){Cn(n,t);var e=Un(n);function n(t,r){var o;return kn(this,n),(o=e.call(this,t,r)).itemClass=Ln,o}return Tn(n,[{key:"getFeed",value:function(){var t=arguments.length>0&&void 0!==arguments[0]?arguments[0]:3e4,e="feed",n=sr;return this._getResource(e,n,null,t)}}]),n}(C);function Wn(t){return Wn="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(t){return typeof t}:function(t){return t&&"function"==typeof Symbol&&t.constructor===Symbol&&t!==Symbol.prototype?"symbol":typeof t},Wn(t)}function Gn(t,e){if(!(t instanceof e))throw new TypeError("Cannot call a class as a function")}function Jn(t,e){for(var n=0;n<e.length;n++){var r=e[n];r.enumerable=r.enumerable||!1,r.configurable=!0,"value"in r&&(r.writable=!0),Object.defineProperty(t,r.key,r)}}function Hn(t,e,n){return e&&Jn(t.prototype,e),n&&Jn(t,n),Object.defineProperty(t,"prototype",{writable:!1}),t}function Vn(t,e){if("function"!=typeof e&&null!==e)throw new TypeError("Super expression must either be null or a function");t.prototype=Object.create(e&&e.prototype,{constructor:{value:t,writable:!0,configurable:!0}}),Object.defineProperty(t,"prototype",{writable:!1}),e&&$n(t,e)}function $n(t,e){return $n=Object.setPrototypeOf||function(t,e){return t.__proto__=e,t},$n(t,e)}function Kn(t){var e=function(){if("undefined"==typeof Reflect||!Reflect.construct)return!1;if(Reflect.construct.sham)return!1;if("function"==typeof Proxy)return!0;try{return Boolean.prototype.valueOf.call(Reflect.construct(Boolean,[],(function(){}))),!0}catch(t){return!1}}();return function(){var n,r=Yn(t);if(e){var o=Yn(this).constructor;n=Reflect.construct(r,arguments,o)}else n=r.apply(this,arguments);return Xn(this,n)}}function Xn(t,e){if(e&&("object"===Wn(e)||"function"==typeof e))return e;if(void 0!==e)throw new TypeError("Derived constructors may only return object or undefined");return function(t){if(void 0===t)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return t}(t)}function Yn(t){return Yn=Object.setPrototypeOf?Object.getPrototypeOf:function(t){return t.__proto__||Object.getPrototypeOf(t)},Yn(t)}var Qn=function(t){Vn(n,t);var e=Kn(n);function n(t,r){return Gn(this,n),e.call(this,t,r)}return Hn(n,[{key:"getFeed",value:function(){var t=arguments.length>0&&void 0!==arguments[0]?arguments[0]:3e4,e="feed",n=sr;return this._getResource(e,n,null,t)}},{key:"put",value:function(t){var e=arguments.length>1&&void 0!==arguments[1]?arguments[1]:3e4;return this._put(t,null,e)}},{key:"delete",value:function(){var t=arguments.length>0&&void 0!==arguments[0]?arguments[0]:3e4;return this._delete(t)}}]),n}(T),Zn=function(t){Vn(n,t);var e=Kn(n);function n(t,r){var o;return Gn(this,n),(o=e.call(this,t,r)).itemClass=Qn,o}return Hn(n,[{key:"getFeed",value:function(){var t=arguments.length>0&&void 0!==arguments[0]?arguments[0]:3e4,e="feed",n=sr;return this._getResource(e,n,null,t)}},{key:"post",value:function(t){var e=arguments.length>1&&void 0!==arguments[1]?arguments[1]:3e4;return this._post(t,null,e)}}]),n}(C);function tr(t){return tr="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(t){return typeof t}:function(t){return t&&"function"==typeof Symbol&&t.constructor===Symbol&&t!==Symbol.prototype?"symbol":typeof t},tr(t)}function er(t,e){if(!(t instanceof e))throw new TypeError("Cannot call a class as a function")}function nr(t,e){for(var n=0;n<e.length;n++){var r=e[n];r.enumerable=r.enumerable||!1,r.configurable=!0,"value"in r&&(r.writable=!0),Object.defineProperty(t,r.key,r)}}function rr(t,e,n){return e&&nr(t.prototype,e),n&&nr(t,n),Object.defineProperty(t,"prototype",{writable:!1}),t}function or(t,e){if("function"!=typeof e&&null!==e)throw new TypeError("Super expression must either be null or a function");t.prototype=Object.create(e&&e.prototype,{constructor:{value:t,writable:!0,configurable:!0}}),Object.defineProperty(t,"prototype",{writable:!1}),e&&ir(t,e)}function ir(t,e){return ir=Object.setPrototypeOf||function(t,e){return t.__proto__=e,t},ir(t,e)}function ur(t){var e=function(){if("undefined"==typeof Reflect||!Reflect.construct)return!1;if(Reflect.construct.sham)return!1;if("function"==typeof Proxy)return!0;try{return Boolean.prototype.valueOf.call(Reflect.construct(Boolean,[],(function(){}))),!0}catch(t){return!1}}();return function(){var n,r=ar(t);if(e){var o=ar(this).constructor;n=Reflect.construct(r,arguments,o)}else n=r.apply(this,arguments);return cr(this,n)}}function cr(t,e){if(e&&("object"===tr(e)||"function"==typeof e))return e;if(void 0!==e)throw new TypeError("Derived constructors may only return object or undefined");return function(t){if(void 0===t)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return t}(t)}function ar(t){return ar=Object.setPrototypeOf?Object.getPrototypeOf:function(t){return t.__proto__||Object.getPrototypeOf(t)},ar(t)}var sr=function(t){or(n,t);var e=ur(n);function n(){return er(this,n),e.apply(this,arguments)}return rr(n,[{key:"getNote",value:function(){var t=arguments.length>0&&void 0!==arguments[0]?arguments[0]:3e4,e="note",n=Rn;return this._getResource(e,n,null,t)}},{key:"getTags",value:function(){var t=arguments.length>0&&void 0!==arguments[0]?arguments[0]:null,e=arguments.length>1&&void 0!==arguments[1]?arguments[1]:3e4,n="tags",r=zn;return this._getResource(n,r,t,e)}},{key:"getTaggings",value:function(){var t=arguments.length>0&&void 0!==arguments[0]?arguments[0]:null,e=arguments.length>1&&void 0!==arguments[1]?arguments[1]:3e4,n="taggings",r=Mn;return this._getResource(n,r,t,e)}},{key:"getComments",value:function(){var t=arguments.length>0&&void 0!==arguments[0]?arguments[0]:null,e=arguments.length>1&&void 0!==arguments[1]?arguments[1]:3e4,n="comments",r=Zn;return this._getResource(n,r,t,e)}},{key:"getComment",value:function(t){var e=arguments.length>1&&void 0!==arguments[1]?arguments[1]:3e4;return this.getComments({id:t},e).then((function(e){return e.getItem(t)}))}},{key:"getFiles",value:function(){var t=arguments.length>0&&void 0!==arguments[0]?arguments[0]:null,e=arguments.length>1&&void 0!==arguments[1]?arguments[1]:3e4,n="files",r=lt;return this._getResource(n,r,t,e)}},{key:"getPluginInstances",value:function(){var t=arguments.length>0&&void 0!==arguments[0]?arguments[0]:null,e=arguments.length>1&&void 0!==arguments[1]?arguments[1]:3e4,n="plugin_instances",r=Zt;return this._getResource(n,r,t,e)}},{key:"tagFeed",value:function(t){var e=arguments.length>1&&void 0!==arguments[1]?arguments[1]:3e4;return this.getTaggings(e).then((function(e){return e.post({tag_id:t})}),e).then((function(t){return t.getItems()[0]}))}},{key:"put",value:function(t){var e=arguments.length>1&&void 0!==arguments[1]?arguments[1]:3e4;return this._put(t,null,e)}},{key:"delete",value:function(){var t=arguments.length>0&&void 0!==arguments[0]?arguments[0]:3e4;return this._delete(t)}}]),n}(T),lr=function(t){or(n,t);var e=ur(n);function n(t,r){var o;return er(this,n),(o=e.call(this,t,r)).itemClass=sr,o}return rr(n,[{key:"getFiles",value:function(){var t=arguments.length>0&&void 0!==arguments[0]?arguments[0]:null,e=arguments.length>1&&void 0!==arguments[1]?arguments[1]:3e4,n="files",r=ft;return this._getResource(n,r,t,e)}},{key:"getComputeResources",value:function(){var t=arguments.length>0&&void 0!==arguments[0]?arguments[0]:null,e=arguments.length>1&&void 0!==arguments[1]?arguments[1]:3e4,n="compute_resources",r=De;return this._getResource(n,r,t,e)}},{key:"getPlugins",value:function(){var t=arguments.length>0&&void 0!==arguments[0]?arguments[0]:null,e=arguments.length>1&&void 0!==arguments[1]?arguments[1]:3e4,n="plugins",r=Se;return this._getResource(n,r,t,e)}},{key:"getPluginInstances",value:function(){var t=arguments.length>0&&void 0!==arguments[0]?arguments[0]:null,e=arguments.length>1&&void 0!==arguments[1]?arguments[1]:3e4,n="plugin_instances",r=Qt;return this._getResource(n,r,t,e)}},{key:"getPipelines",value:function(){var t=arguments.length>0&&void 0!==arguments[0]?arguments[0]:null,e=arguments.length>1&&void 0!==arguments[1]?arguments[1]:3e4,n="pipelines",r=_t;return this._getResource(n,r,t,e)}},{key:"getPipelineInstances",value:function(){var t=arguments.length>0&&void 0!==arguments[0]?arguments[0]:null,e=arguments.length>1&&void 0!==arguments[1]?arguments[1]:3e4,n="pipeline_instances",r=Mt;return this._getResource(n,r,t,e)}},{key:"getTags",value:function(){var t=arguments.length>0&&void 0!==arguments[0]?arguments[0]:null,e=arguments.length>1&&void 0!==arguments[1]?arguments[1]:3e4,n="tags",r=Bn;return this._getResource(n,r,t,e)}},{key:"getUploadedFiles",value:function(){var t=arguments.length>0&&void 0!==arguments[0]?arguments[0]:null,e=arguments.length>1&&void 0!==arguments[1]?arguments[1]:3e4,n="uploadedfiles",r=Ye;return this._getResource(n,r,t,e)}},{key:"getPACSFiles",value:function(){var t=arguments.length>0&&void 0!==arguments[0]?arguments[0]:null,e=arguments.length>1&&void 0!==arguments[1]?arguments[1]:3e4,n="pacsfiles",r=sn;return this._getResource(n,r,t,e)}},{key:"getServiceFiles",value:function(){var t=arguments.length>0&&void 0!==arguments[0]?arguments[0]:null,e=arguments.length>1&&void 0!==arguments[1]?arguments[1]:3e4,n="servicefiles",r=wn;return this._getResource(n,r,t,e)}},{key:"getUser",value:function(){var t=arguments.length>0&&void 0!==arguments[0]?arguments[0]:3e4,e="user",n=z;return this._getResource(e,n,null,t)}}]),n}(C);function fr(t){return fr="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(t){return typeof t}:function(t){return t&&"function"==typeof Symbol&&t.constructor===Symbol&&t!==Symbol.prototype?"symbol":typeof t},fr(t)}function pr(t,e){if(!(t instanceof e))throw new TypeError("Cannot call a class as a function")}function hr(t,e){for(var n=0;n<e.length;n++){var r=e[n];r.enumerable=r.enumerable||!1,r.configurable=!0,"value"in r&&(r.writable=!0),Object.defineProperty(t,r.key,r)}}function vr(t,e,n){return e&&hr(t.prototype,e),n&&hr(t,n),Object.defineProperty(t,"prototype",{writable:!1}),t}function yr(t,e){if("function"!=typeof e&&null!==e)throw new TypeError("Super expression must either be null or a function");t.prototype=Object.create(e&&e.prototype,{constructor:{value:t,writable:!0,configurable:!0}}),Object.defineProperty(t,"prototype",{writable:!1}),e&&dr(t,e)}function dr(t,e){return dr=Object.setPrototypeOf||function(t,e){return t.__proto__=e,t},dr(t,e)}function gr(t){var e=function(){if("undefined"==typeof Reflect||!Reflect.construct)return!1;if(Reflect.construct.sham)return!1;if("function"==typeof Proxy)return!0;try{return Boolean.prototype.valueOf.call(Reflect.construct(Boolean,[],(function(){}))),!0}catch(t){return!1}}();return function(){var n,r=mr(t);if(e){var o=mr(this).constructor;n=Reflect.construct(r,arguments,o)}else n=r.apply(this,arguments);return br(this,n)}}function br(t,e){if(e&&("object"===fr(e)||"function"==typeof e))return e;if(void 0!==e)throw new TypeError("Derived constructors may only return object or undefined");return function(t){if(void 0===t)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return t}(t)}function mr(t){return mr=Object.setPrototypeOf?Object.getPrototypeOf:function(t){return t.__proto__||Object.getPrototypeOf(t)},mr(t)}var wr=function(t){yr(n,t);var e=gr(n);function n(t,r){return pr(this,n),e.call(this,t,r)}return vr(n,[{key:"getPipeline",value:function(){var t=arguments.length>0&&void 0!==arguments[0]?arguments[0]:3e4,e="pipeline",n=Pt;return this._getResource(e,n,null,t)}},{key:"delete",value:function(){var t=arguments.length>0&&void 0!==arguments[0]?arguments[0]:3e4;return this._delete(t)}}]),n}(T),Or=function(t){yr(n,t);var e=gr(n);function n(t,r){var o;return pr(this,n),(o=e.call(this,t,r)).itemClass=wr,o}return vr(n,[{key:"getPipeline",value:function(){var t=arguments.length>0&&void 0!==arguments[0]?arguments[0]:3e4,e="pipeline",n=Pt;return this._getResource(e,n,null,t)}},{key:"post",value:function(t){var e=arguments.length>1&&void 0!==arguments[1]?arguments[1]:3e4;return this._post(t,null,e)}}]),n}(C),Pr=function(t){yr(n,t);var e=gr(n);function n(t,r){var o;return pr(this,n),(o=e.call(this,t,r)).itemClass=wr,o}return vr(n,[{key:"getPipelines",value:function(){var t=arguments.length>0&&void 0!==arguments[0]?arguments[0]:null,e=arguments.length>1&&void 0!==arguments[1]?arguments[1]:3e4,n="pipelines",r=_t;return this._getResource(n,r,t,e)}}]),n}(C);function _r(t){return _r="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(t){return typeof t}:function(t){return t&&"function"==typeof Symbol&&t.constructor===Symbol&&t!==Symbol.prototype?"symbol":typeof t},_r(t)}function jr(t,e){if(!(t instanceof e))throw new TypeError("Cannot call a class as a function")}function xr(t,e){for(var n=0;n<e.length;n++){var r=e[n];r.enumerable=r.enumerable||!1,r.configurable=!0,"value"in r&&(r.writable=!0),Object.defineProperty(t,r.key,r)}}function Rr(t,e,n){return e&&xr(t.prototype,e),n&&xr(t,n),Object.defineProperty(t,"prototype",{writable:!1}),t}function Sr(t,e){if("function"!=typeof e&&null!==e)throw new TypeError("Super expression must either be null or a function");t.prototype=Object.create(e&&e.prototype,{constructor:{value:t,writable:!0,configurable:!0}}),Object.defineProperty(t,"prototype",{writable:!1}),e&&kr(t,e)}function kr(t,e){return kr=Object.setPrototypeOf||function(t,e){return t.__proto__=e,t},kr(t,e)}function Er(t){var e=function(){if("undefined"==typeof Reflect||!Reflect.construct)return!1;if(Reflect.construct.sham)return!1;if("function"==typeof Proxy)return!0;try{return Boolean.prototype.valueOf.call(Reflect.construct(Boolean,[],(function(){}))),!0}catch(t){return!1}}();return function(){var n,r=Cr(t);if(e){var o=Cr(this).constructor;n=Reflect.construct(r,arguments,o)}else n=r.apply(this,arguments);return Tr(this,n)}}function Tr(t,e){if(e&&("object"===_r(e)||"function"==typeof e))return e;if(void 0!==e)throw new TypeError("Derived constructors may only return object or undefined");return function(t){if(void 0===t)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return t}(t)}function Cr(t){return Cr=Object.setPrototypeOf?Object.getPrototypeOf:function(t){return t.__proto__||Object.getPrototypeOf(t)},Cr(t)}var Ir=function(t){Sr(n,t);var e=Er(n);function n(t,r){return jr(this,n),e.call(this,t,r)}return Rr(n,[{key:"getFileBlob",value:function(){var t=arguments.length>0&&void 0!==arguments[0]?arguments[0]:3e4;if(this.isEmpty)throw new y("Item object has not been set!");var e=new b(this.auth,"application/octet-stream",t),n=this.collection.items[0],r=u.getLinkRelationUrls(n,"file_resource")[0];return e.get(r).then((function(t){return t.data}))}}]),n}(T),Ur=function(t){Sr(n,t);var e=Er(n);function n(t,r){var o;return jr(this,n),(o=e.call(this,t,r)).itemClass=Ir,o}return Rr(n)}(C),Ar=function(t){Sr(n,t);var e=Er(n);function n(t,r){return jr(this,n),e.call(this,t,r)}return Rr(n,[{key:"getFiles",value:function(){var t=arguments.length>0&&void 0!==arguments[0]?arguments[0]:null,e=arguments.length>1&&void 0!==arguments[1]?arguments[1]:3e4,n="files",r=Ur;return this._getResource(n,r,t,e)}}]),n}(T),Fr=function(t){Sr(n,t);var e=Er(n);function n(t,r){var o;return jr(this,n),(o=e.call(this,t,r)).itemClass=Ar,o}return Rr(n)}(C);function Lr(t,e){var n="undefined"!=typeof Symbol&&t[Symbol.iterator]||t["@@iterator"];if(!n){if(Array.isArray(t)||(n=function(t,e){if(t){if("string"==typeof t)return Br(t,e);var n=Object.prototype.toString.call(t).slice(8,-1);return"Object"===n&&t.constructor&&(n=t.constructor.name),"Map"===n||"Set"===n?Array.from(t):"Arguments"===n||/^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)?Br(t,e):void 0}}(t))||e&&t&&"number"==typeof t.length){n&&(t=n);var r=0,o=function(){};return{s:o,n:function(){return r>=t.length?{done:!0}:{done:!1,value:t[r++]}},e:function(t){throw t},f:o}}throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")}var i,u=!0,c=!1;return{s:function(){n=n.call(t)},n:function(){var t=n.next();return u=t.done,t},e:function(t){c=!0,i=t},f:function(){try{u||null==n.return||n.return()}finally{if(c)throw i}}}}function Br(t,e){(null==e||e>t.length)&&(e=t.length);for(var n=0,r=new Array(e);n<e;n++)r[n]=t[n];return r}function Nr(t,e){for(var n=0;n<e.length;n++){var r=e[n];r.enumerable=r.enumerable||!1,r.configurable=!0,"value"in r&&(r.writable=!0),Object.defineProperty(t,r.key,r)}}var Dr=function(){function t(e,n){if(function(t,e){if(!(t instanceof e))throw new TypeError("Cannot call a class as a function")}(this,t),this.url=e,!n)throw new y("Authentication object is required");this.auth=n,this.feedsUrl=this.url,this.chrisInstanceUrl="",this.filesUrl="",this.computeResourcesUrl="",this.pluginMetasUrl="",this.pluginsUrl="",this.pluginInstancesUrl="",this.pipelinesUrl="",this.pipelineInstancesUrl="",this.workflowsUrl="",this.tagsUrl="",this.uploadedFilesUrl="",this.pacsFilesUrl="",this.serviceFilesUrl="",this.fileBrowserUrl="",this.userUrl=""}var e,n,r;return e=t,n=[{key:"setUrls",value:function(){var t=arguments.length>0&&void 0!==arguments[0]?arguments[0]:3e4;return this.getFeeds(null,t)}},{key:"getChrisInstance",value:function(){var t=arguments.length>0&&void 0!==arguments[0]?arguments[0]:3e4;return this._fetchRes("chrisInstanceUrl",L,null,t)}},{key:"getFeeds",value:function(){var t=this,e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:null,n=arguments.length>1&&void 0!==arguments[1]?arguments[1]:3e4,r=new lr(this.feedsUrl,this.auth);return r.get(e,n).then((function(e){var n=e.collection,r=u.getLinkRelationUrls;return t.chrisInstanceUrl=t.chrisInstanceUrl||r(n,"chrisinstance")[0],t.filesUrl=t.filesUrl||r(n,"files")[0],t.computeResourcesUrl=t.computeResourcesUrl||r(n,"compute_resources")[0],t.pluginMetasUrl=t.pluginMetasUrl||r(n,"plugin_metas")[0],t.pluginsUrl=t.pluginsUrl||r(n,"plugins")[0],t.pluginInstancesUrl=t.pluginInstancesUrl||r(n,"plugin_instances")[0],t.pipelinesUrl=t.pipelinesUrl||r(n,"pipelines")[0],t.pipelineInstancesUrl=t.pipelineInstancesUrl||r(n,"pipeline_instances")[0],t.workflowsUrl=t.workflowsUrl||r(n,"workflows")[0],t.tagsUrl=t.tagsUrl||r(n,"tags")[0],t.uploadedFilesUrl=t.uploadedFilesUrl||r(n,"uploadedfiles")[0],t.pacsFilesUrl=t.pacsFilesUrl||r(n,"pacsfiles")[0],t.serviceFilesUrl=t.serviceFilesUrl||r(n,"servicefiles")[0],t.fileBrowserUrl=t.fileBrowserUrl||r(n,"filebrowser")[0],t.userUrl=t.userUrl||r(n,"user")[0],e}))}},{key:"getFeed",value:function(t){var e=arguments.length>1&&void 0!==arguments[1]?arguments[1]:3e4;return this.getFeeds({id:t},e).then((function(e){return e.getItem(t)}))}},{key:"tagFeed",value:function(t,e){var n=arguments.length>2&&void 0!==arguments[2]?arguments[2]:3e4;return this.getFeed(t,n).then((function(t){return t.getTaggings(n)})).then((function(t){return t.post({tag_id:e})}),n).then((function(t){return t.getItems()[0]}))}},{key:"getFiles",value:function(){var t=arguments.length>0&&void 0!==arguments[0]?arguments[0]:null,e=arguments.length>1&&void 0!==arguments[1]?arguments[1]:3e4;return this._fetchRes("filesUrl",ft,t,e)}},{key:"getFile",value:function(t){var e=arguments.length>1&&void 0!==arguments[1]?arguments[1]:3e4;return this.getFiles({id:t},e).then((function(e){return e.getItem(t)}))}},{key:"getComputeResources",value:function(){var t=arguments.length>0&&void 0!==arguments[0]?arguments[0]:null,e=arguments.length>1&&void 0!==arguments[1]?arguments[1]:3e4;return this._fetchRes("computeResourcesUrl",De,t,e)}},{key:"getComputeResource",value:function(t){var e=arguments.length>1&&void 0!==arguments[1]?arguments[1]:3e4;return this.getComputeResources({id:t},e).then((function(e){return e.getItem(t)}))}},{key:"getPluginMetas",value:function(){var t=arguments.length>0&&void 0!==arguments[0]?arguments[0]:null,e=arguments.length>1&&void 0!==arguments[1]?arguments[1]:3e4;return this._fetchRes("pluginMetasUrl",de,t,e)}},{key:"getPluginMeta",value:function(t){var e=arguments.length>1&&void 0!==arguments[1]?arguments[1]:3e4;return this.getPluginMetas({id:t},e).then((function(e){return e.getItem(t)}))}},{key:"getPlugins",value:function(){var t=arguments.length>0&&void 0!==arguments[0]?arguments[0]:null,e=arguments.length>1&&void 0!==arguments[1]?arguments[1]:3e4;return this._fetchRes("pluginsUrl",Se,t,e)}},{key:"getPlugin",value:function(t){var e=arguments.length>1&&void 0!==arguments[1]?arguments[1]:3e4;return this.getPlugins({id:t},e).then((function(e){return e.getItem(t)}))}},{key:"getPluginInstances",value:function(){var t=arguments.length>0&&void 0!==arguments[0]?arguments[0]:null,e=arguments.length>1&&void 0!==arguments[1]?arguments[1]:3e4;return this._fetchRes("pluginInstancesUrl",Qt,t,e)}},{key:"getPluginInstance",value:function(t){var e=arguments.length>1&&void 0!==arguments[1]?arguments[1]:3e4;return this.getPluginInstances({id:t},e).then((function(e){return e.getItem(t)}))}},{key:"createPluginInstance",value:function(t,e){var n=this,r=arguments.length>2&&void 0!==arguments[2]?arguments[2]:3e4;return this.getPlugin(t,r).then((function(t){var o=u.getLinkRelationUrls(t.collection.items[0],"instances");return new Yt(o[0],n.auth).post(e,r)})).then((function(t){return t.getItems()[0]}))}},{key:"createPluginInstanceSplit",value:function(t){var e=this,n=arguments.length>1&&void 0!==arguments[1]?arguments[1]:"",r=arguments.length>2&&void 0!==arguments[2]?arguments[2]:"",o=arguments.length>3&&void 0!==arguments[3]?arguments[3]:3e4;return this.getPluginInstance(t,o).then((function(t){var i=u.getLinkRelationUrls(t.collection.items[0],"splits"),c=new re(i[0],e.auth),a={filter:n};return r&&(a={filter:n,compute_resource_name:r}),c.post(a,o)})).then((function(t){return t.getItems()[0]}))}},{key:"getPipelines",value:function(){var t=arguments.length>0&&void 0!==arguments[0]?arguments[0]:null,e=arguments.length>1&&void 0!==arguments[1]?arguments[1]:3e4;return this._fetchRes("pipelinesUrl",_t,t,e)}},{key:"getPipeline",value:function(t){var e=arguments.length>1&&void 0!==arguments[1]?arguments[1]:3e4;return this.getPipelines({id:t},e).then((function(e){return e.getItem(t)}))}},{key:"createPipeline",value:function(t){var e=this,n=arguments.length>1&&void 0!==arguments[1]?arguments[1]:3e4,r=function(){return new _t(e.pipelinesUrl,e.auth).post(t,n).then((function(t){return t.getItems()[0]}))};return this.pipelinesUrl?r():this.setUrls().then((function(){return r()}))}},{key:"getPipelineInstances",value:function(){var t=arguments.length>0&&void 0!==arguments[0]?arguments[0]:null,e=arguments.length>1&&void 0!==arguments[1]?arguments[1]:3e4;return this._fetchRes("pipelineInstancesUrl",Mt,t,e)}},{key:"getPipelineInstance",value:function(t){var e=arguments.length>1&&void 0!==arguments[1]?arguments[1]:3e4;return this.getPipelineInstances({id:t},e).then((function(e){return e.getItem(t)}))}},{key:"createPipelineInstance",value:function(t,e){var n=this,r=arguments.length>2&&void 0!==arguments[2]?arguments[2]:3e4;return this.getPipeline(t,r).then((function(t){var o=u.getLinkRelationUrls(t.collection.items[0],"instances");return new Dt(o[0],n.auth).post(e,r)})).then((function(t){return t.getItems()[0]}))}},{key:"getWorkflows",value:function(){var t=arguments.length>0&&void 0!==arguments[0]?arguments[0]:null,e=arguments.length>1&&void 0!==arguments[1]?arguments[1]:3e4;return this._fetchRes("workflowsUrl",Pr,t,e)}},{key:"getWorkflow",value:function(t){var e=arguments.length>1&&void 0!==arguments[1]?arguments[1]:3e4;return this.getWorkflows({id:t},e).then((function(e){return e.getItem(t)}))}},{key:"computeWorkflowNodesInfo",value:function(t){var e,n=arguments.length>1&&void 0!==arguments[1]&&arguments[1],r={},o=Lr(t);try{for(o.s();!(e=o.n()).done;){var i=e.value,u=i.plugin_piping_id;u in r||(r[u]={piping_id:u,previous_piping_id:i.previous_plugin_piping_id,compute_resource_name:"host",title:"",plugin_parameter_defaults:[]}),(n||null===i.value)&&r[u].plugin_parameter_defaults.push({name:i.param_name,default:i.value})}}catch(t){o.e(t)}finally{o.f()}var c=[];for(var a in r)0===r[a].plugin_parameter_defaults.length&&delete r[a].plugin_parameter_defaults,c.push(r[a]);return c}},{key:"createWorkflow",value:function(t,e){var n=this,r=arguments.length>2&&void 0!==arguments[2]?arguments[2]:3e4;return this.getPipeline(t,r).then((function(t){var o=u.getLinkRelationUrls(t.collection.items[0],"workflows");return new Or(o[0],n.auth).post(e,r)})).then((function(t){return t.getItems()[0]}))}},{key:"getTags",value:function(){var t=arguments.length>0&&void 0!==arguments[0]?arguments[0]:null,e=arguments.length>1&&void 0!==arguments[1]?arguments[1]:3e4;return this._fetchRes("tagsUrl",Bn,t,e)}},{key:"getTag",value:function(t){var e=arguments.length>1&&void 0!==arguments[1]?arguments[1]:3e4;return this.getTags({id:t},e).then((function(e){return e.getItem(t)}))}},{key:"createTag",value:function(t){var e=this,n=arguments.length>1&&void 0!==arguments[1]?arguments[1]:3e4,r=function(){return new Bn(e.tagsUrl,e.auth).post(t,n).then((function(t){return t.getItems()[0]}))};return this.tagsUrl?r():this.setUrls().then((function(){return r()}))}},{key:"getUploadedFiles",value:function(){var t=arguments.length>0&&void 0!==arguments[0]?arguments[0]:null,e=arguments.length>1&&void 0!==arguments[1]?arguments[1]:3e4;return this._fetchRes("uploadedFilesUrl",Ye,t,e)}},{key:"getUploadedFile",value:function(t){var e=arguments.length>1&&void 0!==arguments[1]?arguments[1]:3e4;return this.getUploadedFiles({id:t},e).then((function(e){return e.getItem(t)}))}},{key:"uploadFile",value:function(t,e){var n=this,r=arguments.length>2&&void 0!==arguments[2]?arguments[2]:3e4,o=function(){return new Ye(n.uploadedFilesUrl,n.auth).post(t,e,r).then((function(t){return t.getItems()[0]}))};return this.uploadedFilesUrl?o():this.setUrls().then((function(){return o()}))}},{key:"getPACSFiles",value:function(){var t=arguments.length>0&&void 0!==arguments[0]?arguments[0]:null,e=arguments.length>1&&void 0!==arguments[1]?arguments[1]:3e4;return this._fetchRes("pacsFilesUrl",sn,t,e)}},{key:"getPACSFile",value:function(t){var e=arguments.length>1&&void 0!==arguments[1]?arguments[1]:3e4;return this.getPACSFiles({id:t},e).then((function(e){return e.getItem(t)}))}},{key:"getServiceFiles",value:function(){var t=arguments.length>0&&void 0!==arguments[0]?arguments[0]:null,e=arguments.length>1&&void 0!==arguments[1]?arguments[1]:3e4;return this._fetchRes("serviceFilesUrl",wn,t,e)}},{key:"getServiceFile",value:function(t){var e=arguments.length>1&&void 0!==arguments[1]?arguments[1]:3e4;return this.getServiceFiles({id:t},e).then((function(e){return e.getItem(t)}))}},{key:"getFileBrowserPaths",value:function(){var t=arguments.length>0&&void 0!==arguments[0]?arguments[0]:null,e=arguments.length>1&&void 0!==arguments[1]?arguments[1]:3e4;return this._fetchRes("fileBrowserUrl",Fr,t,e)}},{key:"getFileBrowserPath",value:function(t){var e=arguments.length>1&&void 0!==arguments[1]?arguments[1]:3e4;return this.getFileBrowserPaths({path:t},e).then((function(t){var e=t.getItems();return e.length?e[0]:null}))}},{key:"getUser",value:function(){var t=arguments.length>0&&void 0!==arguments[0]?arguments[0]:3e4;return this._fetchRes("userUrl",z,null,t)}},{key:"_fetchRes",value:function(t,e){var n=this,r=arguments.length>2&&void 0!==arguments[2]?arguments[2]:null,o=arguments.length>3&&void 0!==arguments[3]?arguments[3]:3e4,i=function(){var i=new e(n[t],n.auth);return r?i.get(r,o):i.get(o)};return this[t]?i():this.setUrls().then((function(){return i()}))}}],r=[{key:"createUser",value:function(t,e,n,r){var o=arguments.length>4&&void 0!==arguments[4]?arguments[4]:3e4,i=new b(void 0,"application/vnd.collection+json",o),u={template:{data:[{name:"username",value:e},{name:"password",value:n},{name:"email",value:r}]}};return i.post(t,u).then((function(t){var r=t.data.collection,o=r.items[0].href,i=new z(o,{username:e,password:n});return i.collection=r,i}))}},{key:"getAuthToken",value:function(t,e,n){var r=arguments.length>3&&void 0!==arguments[3]?arguments[3]:3e4,o=new b(void 0,"application/json",r),i={username:e,password:n};return o.post(t,i).then((function(t){return t.data.token}))}},{key:"runAsyncTask",value:function(t){b.runAsyncTask(t)}}],n&&Nr(e.prototype,n),r&&Nr(e,r),Object.defineProperty(e,"prototype",{writable:!1}),t}();const Mr=Dr})(),r})()}));
},{"process":"node_modules/process/browser.js"}],"src/pluginUtil.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _chrisapi = _interopRequireDefault(require("@fnndsc/chrisapi"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); Object.defineProperty(Constructor, "prototype", { writable: false }); return Constructor; }

var PluginUtil = /*#__PURE__*/function () {
  function PluginUtil(chrisClient) {
    _classCallCheck(this, PluginUtil);

    this.chrisClient = chrisClient;
  }
  /**
   *
   *
   *
   *
   */


  _createClass(PluginUtil, [{
    key: "getPluginId",
    value:
    /**
     *
     *
     *
     */
    function () {
      var _getPluginId = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(pluginName) {
        var searchParams, response;
        return regeneratorRuntime.wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                searchParams = {
                  name: pluginName
                };
                _context.next = 3;
                return this.chrisClient.getPlugins(searchParams);

              case 3:
                response = _context.sent;
                return _context.abrupt("return", response.data[0].id);

              case 5:
              case "end":
                return _context.stop();
            }
          }
        }, _callee, this);
      }));

      function getPluginId(_x) {
        return _getPluginId.apply(this, arguments);
      }

      return getPluginId;
    }()
  }, {
    key: "runPlugin",
    value:
    /**
     * Run a plugin, given its id and params
     *
     *
     *
     */
    function () {
      var _runPlugin = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee2(pluginId, pluginParams) {
        var pluginInst;
        return regeneratorRuntime.wrap(function _callee2$(_context2) {
          while (1) {
            switch (_context2.prev = _context2.next) {
              case 0:
                _context2.next = 2;
                return this.chrisClient.createPluginInstance(pluginId, pluginParams);

              case 2:
                pluginInst = _context2.sent;
                return _context2.abrupt("return", pluginInst);

              case 4:
              case "end":
                return _context2.stop();
            }
          }
        }, _callee2, this);
      }));

      function runPlugin(_x2, _x3) {
        return _runPlugin.apply(this, arguments);
      }

      return runPlugin;
    }()
  }, {
    key: "pollPlugin",
    value:
    /**
     *
     *
     *
     *
     */
    function () {
      var _pollPlugin = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee3(pluginInst, callback) {
        var instId, delay, status, inst;
        return regeneratorRuntime.wrap(function _callee3$(_context3) {
          while (1) {
            switch (_context3.prev = _context3.next) {
              case 0:
                instId = pluginInst.data.id;

                delay = function delay(ms) {
                  return new Promise(function (res) {
                    return setTimeout(res, ms);
                  });
                };

                status = pluginInst.data.status;

              case 3:
                _context3.next = 5;
                return delay(5000);

              case 5:
                _context3.next = 7;
                return this.getPluginInstance(instId);

              case 7:
                inst = _context3.sent;
                status = inst.data.status;
                console.log(status);

              case 10:
                if (status !== 'finishedSuccessfully' && status != 'cancelled') {
                  _context3.next = 3;
                  break;
                }

              case 11:
                if (status == 'finishedSuccessfully' && callback) {
                  callback(pluginInst.data.id, "name");
                }

                return _context3.abrupt("return", status);

              case 13:
              case "end":
                return _context3.stop();
            }
          }
        }, _callee3, this);
      }));

      function pollPlugin(_x4, _x5) {
        return _pollPlugin.apply(this, arguments);
      }

      return pollPlugin;
    }()
  }, {
    key: "getPluginInstance",
    value:
    /**
     *
     *
     *
     */
    function () {
      var _getPluginInstance = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee4(instId) {
        var pluginInst;
        return regeneratorRuntime.wrap(function _callee4$(_context4) {
          while (1) {
            switch (_context4.prev = _context4.next) {
              case 0:
                _context4.next = 2;
                return this.chrisClient.getPluginInstance(instId);

              case 2:
                pluginInst = _context4.sent;
                return _context4.abrupt("return", pluginInst);

              case 4:
              case "end":
                return _context4.stop();
            }
          }
        }, _callee4, this);
      }));

      function getPluginInstance(_x6) {
        return _getPluginInstance.apply(this, arguments);
      }

      return getPluginInstance;
    }()
  }], [{
    key: "createService",
    value: function createService(chrisClient) {
      return new PluginUtil(chrisClient);
    }
  }]);

  return PluginUtil;
}();

exports.default = PluginUtil;
},{"@fnndsc/chrisapi":"node_modules/@fnndsc/chrisapi/dist/chrisapi.js"}],"node_modules/file-saver/dist/FileSaver.min.js":[function(require,module,exports) {
var define;
var global = arguments[3];
(function(a,b){if("function"==typeof define&&define.amd)define([],b);else if("undefined"!=typeof exports)b();else{b(),a.FileSaver={exports:{}}.exports}})(this,function(){"use strict";function b(a,b){return"undefined"==typeof b?b={autoBom:!1}:"object"!=typeof b&&(console.warn("Deprecated: Expected third argument to be a object"),b={autoBom:!b}),b.autoBom&&/^\s*(?:text\/\S*|application\/xml|\S*\/\S*\+xml)\s*;.*charset\s*=\s*utf-8/i.test(a.type)?new Blob(["\uFEFF",a],{type:a.type}):a}function c(a,b,c){var d=new XMLHttpRequest;d.open("GET",a),d.responseType="blob",d.onload=function(){g(d.response,b,c)},d.onerror=function(){console.error("could not download file")},d.send()}function d(a){var b=new XMLHttpRequest;b.open("HEAD",a,!1);try{b.send()}catch(a){}return 200<=b.status&&299>=b.status}function e(a){try{a.dispatchEvent(new MouseEvent("click"))}catch(c){var b=document.createEvent("MouseEvents");b.initMouseEvent("click",!0,!0,window,0,0,0,80,20,!1,!1,!1,!1,0,null),a.dispatchEvent(b)}}var f="object"==typeof window&&window.window===window?window:"object"==typeof self&&self.self===self?self:"object"==typeof global&&global.global===global?global:void 0,a=f.navigator&&/Macintosh/.test(navigator.userAgent)&&/AppleWebKit/.test(navigator.userAgent)&&!/Safari/.test(navigator.userAgent),g=f.saveAs||("object"!=typeof window||window!==f?function(){}:"download"in HTMLAnchorElement.prototype&&!a?function(b,g,h){var i=f.URL||f.webkitURL,j=document.createElement("a");g=g||b.name||"download",j.download=g,j.rel="noopener","string"==typeof b?(j.href=b,j.origin===location.origin?e(j):d(j.href)?c(b,g,h):e(j,j.target="_blank")):(j.href=i.createObjectURL(b),setTimeout(function(){i.revokeObjectURL(j.href)},4E4),setTimeout(function(){e(j)},0))}:"msSaveOrOpenBlob"in navigator?function(f,g,h){if(g=g||f.name||"download","string"!=typeof f)navigator.msSaveOrOpenBlob(b(f,h),g);else if(d(f))c(f,g,h);else{var i=document.createElement("a");i.href=f,i.target="_blank",setTimeout(function(){e(i)})}}:function(b,d,e,g){if(g=g||open("","_blank"),g&&(g.document.title=g.document.body.innerText="downloading..."),"string"==typeof b)return c(b,d,e);var h="application/octet-stream"===b.type,i=/constructor/i.test(f.HTMLElement)||f.safari,j=/CriOS\/[\d]+/.test(navigator.userAgent);if((j||h&&i||a)&&"undefined"!=typeof FileReader){var k=new FileReader;k.onloadend=function(){var a=k.result;a=j?a:a.replace(/^data:[^;]*;/,"data:attachment/file;"),g?g.location.href=a:location=a,g=null},k.readAsDataURL(b)}else{var l=f.URL||f.webkitURL,m=l.createObjectURL(b);g?g.location=m:location.href=m,g=null,setTimeout(function(){l.revokeObjectURL(m)},4E4)}});f.saveAs=g.saveAs=g,"undefined"!=typeof module&&(module.exports=g)});


},{}],"src/filesUtil.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _chrisapi = _interopRequireWildcard(require("@fnndsc/chrisapi"));

var _fileSaver = _interopRequireDefault(require("file-saver"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function (nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }

function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function _createForOfIteratorHelper(o, allowArrayLike) { var it = typeof Symbol !== "undefined" && o[Symbol.iterator] || o["@@iterator"]; if (!it) { if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") { if (it) o = it; var i = 0; var F = function F() {}; return { s: F, n: function n() { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }, e: function e(_e) { throw _e; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var normalCompletion = true, didErr = false, err; return { s: function s() { it = it.call(o); }, n: function n() { var step = it.next(); normalCompletion = step.done; return step; }, e: function e(_e2) { didErr = true; err = _e2; }, f: function f() { try { if (!normalCompletion && it.return != null) it.return(); } finally { if (didErr) throw err; } } }; }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); Object.defineProperty(Constructor, "prototype", { writable: false }); return Constructor; }

var FilesUtil = /*#__PURE__*/function () {
  function FilesUtil(chrisClient) {
    _classCallCheck(this, FilesUtil);

    this.chrisClient = chrisClient;
  }

  _createClass(FilesUtil, [{
    key: "uploadFiles",
    value:
    /**
     * Upload files to CUBE
     *
     * @param {Array} files An array of files object
     *
     * @return {Promise<String>}  JS Promise, resolves to a string value 
     */
    function () {
      var _uploadFiles = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(files) {
        var user, uploadDir, f, upload;
        return regeneratorRuntime.wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                if (files.length == 0) {
                  console.log("Please upload files!");
                } //Upload all files to CUBE


                _context.next = 3;
                return this.chrisClient.getUser();

              case 3:
                user = _context.sent;
                uploadDir = user.data.username + '/uploads/' + Date.now() + '/';
                f = 0;

              case 6:
                if (!(f < files.length)) {
                  _context.next = 13;
                  break;
                }

                _context.next = 9;
                return this.chrisClient.uploadFile({
                  upload_path: uploadDir + files[f].name
                }, {
                  fname: files[f]
                });

              case 9:
                upload = _context.sent;

              case 10:
                f++;
                _context.next = 6;
                break;

              case 13:
                return _context.abrupt("return", uploadDir);

              case 14:
              case "end":
                return _context.stop();
            }
          }
        }, _callee, this);
      }));

      function uploadFiles(_x) {
        return _uploadFiles.apply(this, arguments);
      }

      return uploadFiles;
    }()
  }, {
    key: "downloadFiles",
    value:
    /**
     *
     *
     *
     */
    function () {
      var _downloadFiles = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee2() {
        return regeneratorRuntime.wrap(function _callee2$(_context2) {
          while (1) {
            switch (_context2.prev = _context2.next) {
              case 0:
              case "end":
                return _context2.stop();
            }
          }
        }, _callee2);
      }));

      function downloadFiles() {
        return _downloadFiles.apply(this, arguments);
      }

      return downloadFiles;
    }()
  }, {
    key: "downloadZip",
    value:
    /**
     * Download files of a particular feed from CUBE
     *
     * @param {number} feedId Id of a particular feed in CUBE
     */
    function () {
      var _downloadZip = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee3(pfdoInst, zipName) {
        var params, pluginFiles, _iterator, _step, pluginFile, filePath, paths, fileName, resp;

        return regeneratorRuntime.wrap(function _callee3$(_context3) {
          while (1) {
            switch (_context3.prev = _context3.next) {
              case 0:
                params = {
                  limit: 200,
                  offset: 0
                };
                _context3.next = 3;
                return pfdoInst.getFiles(params);

              case 3:
                pluginFiles = _context3.sent;
                _iterator = _createForOfIteratorHelper(pluginFiles.collection.items);
                _context3.prev = 5;

                _iterator.s();

              case 7:
                if ((_step = _iterator.n()).done) {
                  _context3.next = 19;
                  break;
                }

                pluginFile = _step.value;
                filePath = pluginFile.data[2].value;
                paths = filePath.split('/');
                fileName = paths[paths.length - 1];

                if (!(fileName == 'parent.zip')) {
                  _context3.next = 17;
                  break;
                }

                _context3.next = 15;
                return this._download(pluginFile.links[0].href);

              case 15:
                resp = _context3.sent;

                _fileSaver.default.saveAs(resp, zipName + ".zip");

              case 17:
                _context3.next = 7;
                break;

              case 19:
                _context3.next = 24;
                break;

              case 21:
                _context3.prev = 21;
                _context3.t0 = _context3["catch"](5);

                _iterator.e(_context3.t0);

              case 24:
                _context3.prev = 24;

                _iterator.f();

                return _context3.finish(24);

              case 27:
              case "end":
                return _context3.stop();
            }
          }
        }, _callee3, this, [[5, 21, 24, 27]]);
      }));

      function downloadZip(_x2, _x3) {
        return _downloadZip.apply(this, arguments);
      }

      return downloadZip;
    }()
  }, {
    key: "_download",
    value:
    /**
     * Private method to download a blob/file/stream from CUBE 
     *
     * @param {String} url API endpoint to a particular resource in CUBE
     * @response {Promise} JS promise, resolves to a string value
     */
    function _download(url) {
      var req = new _chrisapi.Request(this.chrisClient.auth, 'application/octet-stream', 30000000);
      var blobUrl = url;
      return req.get(blobUrl).then(function (resp) {
        return resp.data;
      });
    }
  }], [{
    key: "createService",
    value: function createService(chrisClient) {
      return new FilesUtil(chrisClient);
    }
  }]);

  return FilesUtil;
}();

exports.default = FilesUtil;
},{"@fnndsc/chrisapi":"node_modules/@fnndsc/chrisapi/dist/chrisapi.js","file-saver":"node_modules/file-saver/dist/FileSaver.min.js"}],"src/feedUtil.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _chrisapi = _interopRequireDefault(require("@fnndsc/chrisapi"));

var _pluginUtil = _interopRequireDefault(require("./pluginUtil"));

var _filesUtil = _interopRequireDefault(require("./filesUtil"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _createForOfIteratorHelper(o, allowArrayLike) { var it = typeof Symbol !== "undefined" && o[Symbol.iterator] || o["@@iterator"]; if (!it) { if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") { if (it) o = it; var i = 0; var F = function F() {}; return { s: F, n: function n() { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }, e: function e(_e) { throw _e; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var normalCompletion = true, didErr = false, err; return { s: function s() { it = it.call(o); }, n: function n() { var step = it.next(); normalCompletion = step.done; return step; }, e: function e(_e2) { didErr = true; err = _e2; }, f: function f() { try { if (!normalCompletion && it.return != null) it.return(); } finally { if (didErr) throw err; } } }; }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); Object.defineProperty(Constructor, "prototype", { writable: false }); return Constructor; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var FeedUtil = /*#__PURE__*/function () {
  function FeedUtil(chrisClient) {
    _classCallCheck(this, FeedUtil);

    _defineProperty(this, "getRunTime", /*#__PURE__*/function () {
      var _ref = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(feed) {
        var pluginInstances, totalRunTime, _iterator, _step, pluginInstance, startTime, endTime;

        return regeneratorRuntime.wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                _context.next = 2;
                return feed.getPluginInstances();

              case 2:
                pluginInstances = _context.sent;
                totalRunTime = 0;
                _iterator = _createForOfIteratorHelper(pluginInstances.data);

                try {
                  for (_iterator.s(); !(_step = _iterator.n()).done;) {
                    pluginInstance = _step.value;
                    startTime = Date.parse(pluginInstance.start_date);
                    endTime = Date.parse(pluginInstance.end_date);
                    totalRunTime += endTime - startTime;
                  }
                } catch (err) {
                  _iterator.e(err);
                } finally {
                  _iterator.f();
                }

                return _context.abrupt("return", totalRunTime / 60000);

              case 7:
              case "end":
                return _context.stop();
            }
          }
        }, _callee);
      }));

      return function (_x) {
        return _ref.apply(this, arguments);
      };
    }());

    _defineProperty(this, "getSize", /*#__PURE__*/function () {
      var _ref2 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee2(feed) {
        var pluginInstances, totalSize, _iterator2, _step2, pluginInstance;

        return regeneratorRuntime.wrap(function _callee2$(_context2) {
          while (1) {
            switch (_context2.prev = _context2.next) {
              case 0:
                _context2.next = 2;
                return feed.getPluginInstances();

              case 2:
                pluginInstances = _context2.sent;
                totalSize = 0;
                _iterator2 = _createForOfIteratorHelper(pluginInstances.data);

                try {
                  for (_iterator2.s(); !(_step2 = _iterator2.n()).done;) {
                    pluginInstance = _step2.value;
                    totalSize += pluginInstance.size;
                  }
                } catch (err) {
                  _iterator2.e(err);
                } finally {
                  _iterator2.f();
                }

                return _context2.abrupt("return", totalSize / 1000000);

              case 7:
              case "end":
                return _context2.stop();
            }
          }
        }, _callee2);
      }));

      return function (_x2) {
        return _ref2.apply(this, arguments);
      };
    }());

    _defineProperty(this, "getFeedProgress", /*#__PURE__*/function () {
      var _ref3 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee3(feed) {
        var LOOKUP, pluginInstances, totalMilestones, completedMilestones, _iterator3, _step3, pluginInstance, status, progressPercentage;

        return regeneratorRuntime.wrap(function _callee3$(_context3) {
          while (1) {
            switch (_context3.prev = _context3.next) {
              case 0:
                LOOKUP = new Map();
                LOOKUP.set("cancelled", 0);
                LOOKUP.set("started", 1);
                LOOKUP.set("waiting", 2);
                LOOKUP.set("registeringFiles", 3);
                LOOKUP.set("finishedSuccessfully", 4);
                _context3.next = 8;
                return feed.getPluginInstances();

              case 8:
                pluginInstances = _context3.sent;
                totalMilestones = pluginInstances.data.length * 4;
                completedMilestones = 0;
                _iterator3 = _createForOfIteratorHelper(pluginInstances.data);

                try {
                  for (_iterator3.s(); !(_step3 = _iterator3.n()).done;) {
                    pluginInstance = _step3.value;
                    status = pluginInstance.status;
                    completedMilestones += LOOKUP.get(status);
                  }
                } catch (err) {
                  _iterator3.e(err);
                } finally {
                  _iterator3.f();
                }

                progressPercentage = completedMilestones / totalMilestones * 100;
                return _context3.abrupt("return", progressPercentage);

              case 15:
              case "end":
                return _context3.stop();
            }
          }
        }, _callee3);
      }));

      return function (_x3) {
        return _ref3.apply(this, arguments);
      };
    }());

    this.chrisClient = chrisClient;
  }
  /**
   *
   *
   *
   */


  _createClass(FeedUtil, [{
    key: "getFeed",
    value:
    /**
     * Get a feed given it's id
     *
     */
    function () {
      var _getFeed = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee4(id) {
        var feed;
        return regeneratorRuntime.wrap(function _callee4$(_context4) {
          while (1) {
            switch (_context4.prev = _context4.next) {
              case 0:
                _context4.next = 2;
                return this.chrisClient.getFeed(id);

              case 2:
                feed = _context4.sent;
                return _context4.abrupt("return", feed);

              case 4:
              case "end":
                return _context4.stop();
            }
          }
        }, _callee4, this);
      }));

      function getFeed(_x4) {
        return _getFeed.apply(this, arguments);
      }

      return getFeed;
    }()
    /**
     *
     *
     *
     *
     */

  }, {
    key: "createFeed",
    value: function () {
      var _createFeed = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee5(dataPath, feedName) {
        var pluginService, dircopyId, dircopyParams, dircopyInst, newFeed;
        return regeneratorRuntime.wrap(function _callee5$(_context5) {
          while (1) {
            switch (_context5.prev = _context5.next) {
              case 0:
                // Get plugin id of pl-dircopy
                pluginService = _pluginUtil.default.createService(this.chrisClient);
                _context5.next = 3;
                return pluginService.getPluginId("pl-dircopy");

              case 3:
                dircopyId = _context5.sent;
                dircopyParams = {
                  dir: dataPath,
                  previous_id: 0,
                  title: feedName
                }; // Schedule a new pl-dircopy and return the feed

                _context5.next = 7;
                return pluginService.runPlugin(dircopyId, dircopyParams);

              case 7:
                dircopyInst = _context5.sent;
                _context5.next = 10;
                return dircopyInst.getFeed();

              case 10:
                newFeed = _context5.sent;
                return _context5.abrupt("return", newFeed);

              case 12:
              case "end":
                return _context5.stop();
            }
          }
        }, _callee5, this);
      }));

      function createFeed(_x5, _x6) {
        return _createFeed.apply(this, arguments);
      }

      return createFeed;
    }()
    /**
     *
     *
     *
     *
     */

  }, {
    key: "createAndZipFeed",
    value: function () {
      var _createAndZipFeed = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee6(dataPath, feedName, zipName) {
        var pluginService, dircopyId, dircopyParams, dircopyInst, pfdorunId, pfdorunParams, pfdoInst, fileService, newFeed;
        return regeneratorRuntime.wrap(function _callee6$(_context6) {
          while (1) {
            switch (_context6.prev = _context6.next) {
              case 0:
                // Get plugin id of pl-dircopy
                pluginService = _pluginUtil.default.createService(this.chrisClient);
                _context6.next = 3;
                return pluginService.getPluginId("pl-dircopy");

              case 3:
                dircopyId = _context6.sent;
                dircopyParams = {
                  dir: dataPath,
                  previous_id: 0,
                  title: feedName
                }; // Schedule a new pl-dircopy and return the feed

                _context6.next = 7;
                return pluginService.runPlugin(dircopyId, dircopyParams);

              case 7:
                dircopyInst = _context6.sent;
                _context6.next = 10;
                return pluginService.getPluginId("pl-pfdorun");

              case 10:
                pfdorunId = _context6.sent;
                pfdorunParams = {
                  title: "zip_files",
                  previous_id: dircopyInst.data.id,
                  inputFile: "input.meta.json",
                  noJobLogging: true,
                  exec: "'zip -r %outputDir/parent.zip %inputDir'"
                };
                console.log("Please wait while we are zipping your files");
                _context6.next = 15;
                return pluginService.runPlugin(pfdorunId, pfdorunParams);

              case 15:
                pfdoInst = _context6.sent;
                _context6.next = 18;
                return pluginService.pollPlugin(pfdoInst);

              case 18:
                fileService = _filesUtil.default.createService(this.chrisClient);
                fileService.downloadZip(pfdoInst, zipName);
                _context6.next = 22;
                return pfdoInst.getFeed();

              case 22:
                newFeed = _context6.sent;
                return _context6.abrupt("return", newFeed);

              case 24:
              case "end":
                return _context6.stop();
            }
          }
        }, _callee6, this);
      }));

      function createAndZipFeed(_x7, _x8, _x9) {
        return _createAndZipFeed.apply(this, arguments);
      }

      return createAndZipFeed;
    }()
  }], [{
    key: "createService",
    value: function createService(chrisClient) {
      return new FeedUtil(chrisClient);
    }
  }]);

  return FeedUtil;
}();

exports.default = FeedUtil;
},{"@fnndsc/chrisapi":"node_modules/@fnndsc/chrisapi/dist/chrisapi.js","./pluginUtil":"src/pluginUtil.js","./filesUtil":"src/filesUtil.js"}],"src/clientUtil.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _chrisapi = _interopRequireDefault(require("@fnndsc/chrisapi"));

var _pluginUtil = _interopRequireDefault(require("./pluginUtil"));

var _filesUtil = _interopRequireDefault(require("./filesUtil"));

var _feedUtil = _interopRequireDefault(require("./feedUtil"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); Object.defineProperty(Constructor, "prototype", { writable: false }); return Constructor; }

var ClientUtil = /*#__PURE__*/function () {
  /**
   * Constructor
   *
   * 
   */
  function ClientUtil(url, userName, chrisClient) {
    _classCallCheck(this, ClientUtil);

    this.url = url;
    this.userName = userName;
    this.chrisClient = chrisClient;
  }
  /**
   * Login to CUBE
   *
   * @param  {String} url CUBE's url
   * @param  {String} userName User's username in CUBE
   * @param  {String} password User's password
   * @return {Promise<Object>} JS Promise, resolves to an object of this class
   */


  _createClass(ClientUtil, [{
    key: "createUploadFeed",
    value:
    /**
     * Upload files to CUBE
     *
     * @param {Array} files An array of files object
     * @param {String} feedName name of the 'pl-dircopy' instance in CUBE
     *
     * @return {Promise<String>}  JS Promise, resolves to a string value 
     */
    function () {
      var _createUploadFeed = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(files, feedName) {
        var filesService, uploadDirName, feedService, newFeed;
        return regeneratorRuntime.wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                // Upload files
                filesService = _filesUtil.default.createService(this.chrisClient);
                _context.next = 3;
                return filesService.uploadFiles(files);

              case 3:
                uploadDirName = _context.sent;
                // Create a new feed
                feedService = _feedUtil.default.createService(this.chrisClient);
                _context.next = 7;
                return feedService.createFeed(uploadDirName, feedName);

              case 7:
                newFeed = _context.sent;
                return _context.abrupt("return", newFeed);

              case 9:
              case "end":
                return _context.stop();
            }
          }
        }, _callee, this);
      }));

      function createUploadFeed(_x, _x2) {
        return _createUploadFeed.apply(this, arguments);
      }

      return createUploadFeed;
    }()
  }, {
    key: "createDownloadFeed",
    value:
    /**
     * Create a downloading feed given a feed id
     *
     *
     *
     */
    function () {
      var _createDownloadFeed = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee2(feedId, newFeedName) {
        var feedService, feed, feedDirPath, newFeed;
        return regeneratorRuntime.wrap(function _callee2$(_context2) {
          while (1) {
            switch (_context2.prev = _context2.next) {
              case 0:
                // Fetch the feed
                feedService = _feedUtil.default.createService(this.chrisClient);
                _context2.next = 3;
                return feedService.getFeed(feedId);

              case 3:
                feed = _context2.sent;
                feedDirPath = feed.data.creator_username + "/feed_" + feedId; // create a new feed & zip contents

                _context2.next = 7;
                return feedService.createAndZipFeed(feedDirPath, newFeedName, feed.data.name);

              case 7:
                newFeed = _context2.sent;
                return _context2.abrupt("return", newFeed);

              case 9:
              case "end":
                return _context2.stop();
            }
          }
        }, _callee2, this);
      }));

      function createDownloadFeed(_x3, _x4) {
        return _createDownloadFeed.apply(this, arguments);
      }

      return createDownloadFeed;
    }()
  }, {
    key: "logout",
    value:
    /**
    * Logout from CUBE
    *
    *
    */
    function logout() {
      this.client = null;
    }
  }], [{
    key: "createService",
    value: function () {
      var _createService = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee3(url, userName, password) {
        var authUrl, authToken, auth, chrisClient;
        return regeneratorRuntime.wrap(function _callee3$(_context3) {
          while (1) {
            switch (_context3.prev = _context3.next) {
              case 0:
                authUrl = url + 'auth-token/';
                _context3.next = 3;
                return _chrisapi.default.getAuthToken(authUrl, userName, password);

              case 3:
                authToken = _context3.sent;
                auth = {
                  token: authToken
                };
                chrisClient = new _chrisapi.default(url, auth);
                return _context3.abrupt("return", new ClientUtil(url, userName, chrisClient));

              case 7:
              case "end":
                return _context3.stop();
            }
          }
        }, _callee3);
      }));

      function createService(_x5, _x6, _x7) {
        return _createService.apply(this, arguments);
      }

      return createService;
    }()
  }, {
    key: "getService",
    value:
    /**
     * Get an instance of this class given an existing chris client
     *
     * @param {Object} chrisClient A ChRIS client object
     *
     * @return {Promise<Object>} JS Promise, resolves to an instance of this class
     */
    function () {
      var _getService = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee4(chrisClient) {
        var url, user;
        return regeneratorRuntime.wrap(function _callee4$(_context4) {
          while (1) {
            switch (_context4.prev = _context4.next) {
              case 0:
                url = "";
                _context4.next = 3;
                return chrisClient.getUser();

              case 3:
                user = _context4.sent;
                return _context4.abrupt("return", new ClientUtil(url, user.data.username, chrisClient));

              case 5:
              case "end":
                return _context4.stop();
            }
          }
        }, _callee4);
      }));

      function getService(_x8) {
        return _getService.apply(this, arguments);
      }

      return getService;
    }()
  }]);

  return ClientUtil;
}();

exports.default = ClientUtil;
},{"@fnndsc/chrisapi":"node_modules/@fnndsc/chrisapi/dist/chrisapi.js","./pluginUtil":"src/pluginUtil.js","./filesUtil":"src/filesUtil.js","./feedUtil":"src/feedUtil.js"}],"index.js":[function(require,module,exports) {
"use strict";

require("regenerator-runtime/runtime");

var _clientUtil = _interopRequireDefault(require("./src/clientUtil"));

var _pluginUtil = _interopRequireDefault(require("./src/pluginUtil"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

var url = "http://localhost:8000/api/v1/";
var user = "cube";
var pass = "cube1234";
var pluginService;
var upload = document.getElementById("upload");
var id = document.getElementById("id");
var btnPoll = document.getElementById("btnPoll"); // Upload files & create a feed

upload.onchange = /*#__PURE__*/_asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee() {
  var service, newFeed;
  return regeneratorRuntime.wrap(function _callee$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          _context.next = 2;
          return _clientUtil.default.createService(url, user, pass);

        case 2:
          service = _context.sent;
          _context.next = 5;
          return service.createUploadFeed(upload.files, "firstFeed");

        case 5:
          newFeed = _context.sent;
          pluginService = _pluginUtil.default.createService(service.chrisClient);

        case 7:
        case "end":
          return _context.stop();
      }
    }
  }, _callee);
}));
btnPoll.onclick = /*#__PURE__*/_asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee2() {
  var service, newFeed;
  return regeneratorRuntime.wrap(function _callee2$(_context2) {
    while (1) {
      switch (_context2.prev = _context2.next) {
        case 0:
          _context2.next = 2;
          return _clientUtil.default.createService(url, user, pass);

        case 2:
          service = _context2.sent;
          _context2.next = 5;
          return service.createDownloadFeed(parseInt(id.value), "download");

        case 5:
          newFeed = _context2.sent;

        case 6:
        case "end":
          return _context2.stop();
      }
    }
  }, _callee2);
}));
},{"regenerator-runtime/runtime":"node_modules/regenerator-runtime/runtime.js","./src/clientUtil":"src/clientUtil.js","./src/pluginUtil":"src/pluginUtil.js"}],"node_modules/parcel-bundler/src/builtins/hmr-runtime.js":[function(require,module,exports) {
var global = arguments[3];
var OVERLAY_ID = '__parcel__error__overlay__';
var OldModule = module.bundle.Module;

function Module(moduleName) {
  OldModule.call(this, moduleName);
  this.hot = {
    data: module.bundle.hotData,
    _acceptCallbacks: [],
    _disposeCallbacks: [],
    accept: function (fn) {
      this._acceptCallbacks.push(fn || function () {});
    },
    dispose: function (fn) {
      this._disposeCallbacks.push(fn);
    }
  };
  module.bundle.hotData = null;
}

module.bundle.Module = Module;
var checkedAssets, assetsToAccept;
var parent = module.bundle.parent;

if ((!parent || !parent.isParcelRequire) && typeof WebSocket !== 'undefined') {
  var hostname = "" || location.hostname;
  var protocol = location.protocol === 'https:' ? 'wss' : 'ws';
  var ws = new WebSocket(protocol + '://' + hostname + ':' + "42389" + '/');

  ws.onmessage = function (event) {
    checkedAssets = {};
    assetsToAccept = [];
    var data = JSON.parse(event.data);

    if (data.type === 'update') {
      var handled = false;
      data.assets.forEach(function (asset) {
        if (!asset.isNew) {
          var didAccept = hmrAcceptCheck(global.parcelRequire, asset.id);

          if (didAccept) {
            handled = true;
          }
        }
      }); // Enable HMR for CSS by default.

      handled = handled || data.assets.every(function (asset) {
        return asset.type === 'css' && asset.generated.js;
      });

      if (handled) {
        console.clear();
        data.assets.forEach(function (asset) {
          hmrApply(global.parcelRequire, asset);
        });
        assetsToAccept.forEach(function (v) {
          hmrAcceptRun(v[0], v[1]);
        });
      } else if (location.reload) {
        // `location` global exists in a web worker context but lacks `.reload()` function.
        location.reload();
      }
    }

    if (data.type === 'reload') {
      ws.close();

      ws.onclose = function () {
        location.reload();
      };
    }

    if (data.type === 'error-resolved') {
      console.log('[parcel] ✨ Error resolved');
      removeErrorOverlay();
    }

    if (data.type === 'error') {
      console.error('[parcel] 🚨  ' + data.error.message + '\n' + data.error.stack);
      removeErrorOverlay();
      var overlay = createErrorOverlay(data);
      document.body.appendChild(overlay);
    }
  };
}

function removeErrorOverlay() {
  var overlay = document.getElementById(OVERLAY_ID);

  if (overlay) {
    overlay.remove();
  }
}

function createErrorOverlay(data) {
  var overlay = document.createElement('div');
  overlay.id = OVERLAY_ID; // html encode message and stack trace

  var message = document.createElement('div');
  var stackTrace = document.createElement('pre');
  message.innerText = data.error.message;
  stackTrace.innerText = data.error.stack;
  overlay.innerHTML = '<div style="background: black; font-size: 16px; color: white; position: fixed; height: 100%; width: 100%; top: 0px; left: 0px; padding: 30px; opacity: 0.85; font-family: Menlo, Consolas, monospace; z-index: 9999;">' + '<span style="background: red; padding: 2px 4px; border-radius: 2px;">ERROR</span>' + '<span style="top: 2px; margin-left: 5px; position: relative;">🚨</span>' + '<div style="font-size: 18px; font-weight: bold; margin-top: 20px;">' + message.innerHTML + '</div>' + '<pre>' + stackTrace.innerHTML + '</pre>' + '</div>';
  return overlay;
}

function getParents(bundle, id) {
  var modules = bundle.modules;

  if (!modules) {
    return [];
  }

  var parents = [];
  var k, d, dep;

  for (k in modules) {
    for (d in modules[k][1]) {
      dep = modules[k][1][d];

      if (dep === id || Array.isArray(dep) && dep[dep.length - 1] === id) {
        parents.push(k);
      }
    }
  }

  if (bundle.parent) {
    parents = parents.concat(getParents(bundle.parent, id));
  }

  return parents;
}

function hmrApply(bundle, asset) {
  var modules = bundle.modules;

  if (!modules) {
    return;
  }

  if (modules[asset.id] || !bundle.parent) {
    var fn = new Function('require', 'module', 'exports', asset.generated.js);
    asset.isNew = !modules[asset.id];
    modules[asset.id] = [fn, asset.deps];
  } else if (bundle.parent) {
    hmrApply(bundle.parent, asset);
  }
}

function hmrAcceptCheck(bundle, id) {
  var modules = bundle.modules;

  if (!modules) {
    return;
  }

  if (!modules[id] && bundle.parent) {
    return hmrAcceptCheck(bundle.parent, id);
  }

  if (checkedAssets[id]) {
    return;
  }

  checkedAssets[id] = true;
  var cached = bundle.cache[id];
  assetsToAccept.push([bundle, id]);

  if (cached && cached.hot && cached.hot._acceptCallbacks.length) {
    return true;
  }

  return getParents(global.parcelRequire, id).some(function (id) {
    return hmrAcceptCheck(global.parcelRequire, id);
  });
}

function hmrAcceptRun(bundle, id) {
  var cached = bundle.cache[id];
  bundle.hotData = {};

  if (cached) {
    cached.hot.data = bundle.hotData;
  }

  if (cached && cached.hot && cached.hot._disposeCallbacks.length) {
    cached.hot._disposeCallbacks.forEach(function (cb) {
      cb(bundle.hotData);
    });
  }

  delete bundle.cache[id];
  bundle(id);
  cached = bundle.cache[id];

  if (cached && cached.hot && cached.hot._acceptCallbacks.length) {
    cached.hot._acceptCallbacks.forEach(function (cb) {
      cb();
    });

    return true;
  }
}
},{}]},{},["node_modules/parcel-bundler/src/builtins/hmr-runtime.js","index.js"], null)
//# sourceMappingURL=/chris-utils.e31bb0bc.js.map