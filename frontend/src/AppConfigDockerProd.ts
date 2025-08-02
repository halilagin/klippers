interface AppConfig {
    baseApiUrl: string;
    baseUrl: string;
    stripePublishableKey: string;
}

const appConfig = {
    // baseApiUrl: "http://host.docker.internal:3081",
    baseApiUrl: "https://klippersai.com",
    baseUrl: "https://klippersai.com",
    // stripePublishableKey: "pk_test_51N808IGg0tCTvsYGCR2GcVwUlkPMOrhwZAIsJH4LThvJCBzcFzS6Ru6YapQlqIbhyYHZ3EhICGIRsnqoagsxYcM500dNmHSaiu",
    stripePublishableKey: "pk_live_51N808IGg0tCTvsYGR5qti2PCp3twwp2okzwIpyXjH3M2DCUCMVemcEMHOP2NKMBFujTYmgE2tKo3NzlK6e9U3jA400gVPvjIOi"
} as AppConfig

export default appConfig
