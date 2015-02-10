define(
    "RxSocketSubject/multiplex",
    ["./utils", "exports"],
    function(RxSocketSubject$utils$$, __exports__) {
        "use strict";

        function __es6_export__(name, value) {
            __exports__[name] = value;
        }

        var extend;
        extend = RxSocketSubject$utils$$["extend"];

        var Observable = Rx.Observable;
        var Subject = Rx.Subject;

        function multiplex(socket, responseFilter, options) {
            var config = {
                serializer: function(data) {
                    return JSON.stringify(data);
                },
                deserializer: function(e) {
                    return JSON.parse(e.data);
                },
                socketProxy: function(messages) {
                    return messages.map(function(d) {
                        return d.value;
                    });
                }
            };

            if(options) {
                extend(config, options);
            }

            var subscriptions;
            var unsubscriptions;
            var count = 0;
            var socketSubDisp;

            var subscribeSocket = function() {
                if(++count === 1) {
                    subscriptions = new Subject();
                    unsubscriptions = new Subject();

                    socketSubDisp = config.socketProxy(Observable.merge(subscriptions.map(function(x) {
                        return { type: 'sub', value: x };
                    }), unsubscriptions.map(function(x) {
                        return { type: 'unsub', value: x };
                    }))).map(config.serializer).subscribe(socket);
                }
            };

            var unsubscribeSocket = function(){
                if(--count === 0) {
                    socketSubDisp.dispose();
                }
            };

            return function multiplex(subscriptionData, unsubscriptionData) {
                return Observable.create(function(obs) {
                    subscribeSocket();
                    subscriptions.onNext(subscriptionData);

                    var disposable = socket.map(config.deserializer).
                        filter(responseFilter(subscriptionData)).
                        subscribe(obs);

                    var multiplexUnsub = function() {
                        unsubscriptions.onNext(unsubscriptionData);
                    };

                    return function() {
                        multiplexUnsub();
                        unsubscribeSocket();
                        disposable.dispose();
                    };
                });
            };
        }
        __es6_export__("default", multiplex);
    }
);

//# sourceMappingURL=multiplex.js.map