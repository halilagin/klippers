interface AppConfig {
    baseApiUrl: string;
    baseUrl: string;
    stripePublishableKey: string;
}

const appConfig = {
    baseApiUrl: "http://localhost:23081",
    // baseApiUrl: "https://klippersai.com",
    baseUrl: "https://localhost:23080",
    stripePublishableKey: "pk_test_51N808IGg0tCTvsYGCR2GcVwUlkPMOrhwZAIsJH4LThvJCBzcFzS6Ru6YapQlqIbhyYHZ3EhICGIRsnqoagsxYcM500dNmHSaiu",
} as AppConfig

export default appConfig
