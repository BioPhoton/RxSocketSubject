- 0.5.0
	- FEATURE: Add `multiplex` method to RxSocketSubject. Multiplex is a new method that returns a function with which Observables can be created that multiplex data over the underlying RxSocketSubject.
	- FEATURE: Add `serializer` and `deserializer` configuration properties to multiplexing. Allows for custom serialization.
	- FEATURE: Add `subscriberProxy` to multiplex configuration. Allows for custom pre-processing of subscription and unsubscription messages prior to being serialized and sent over the socket.
	- FEATURE: Add `messageProxy` to multiplex configuration. Allows for custom processing of raw socket message events prior to deserialization. Useful for things like batching responses.
- 0.4.0
	- REFACTOR: Move RxSocketSubject over to being a custom class extending AnonymousSubject