import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import type { CompositeScreenProps, NavigatorScreenParams } from '@react-navigation/native';

// Root Stack
export type RootStackParamList = {
    Auth: NavigatorScreenParams<AuthStackParamList>;
    Onboarding: undefined;
    MainApp: NavigatorScreenParams<MainTabParamList>;
};

// Auth Stack
export type AuthStackParamList = {
    Login: undefined;
    SignUp: undefined;
    ForgotPassword: undefined;
};

// Main Tab Navigator
export type MainTabParamList = {
    Home: undefined;
    Journal: undefined;
    Steps: undefined;
    Profile: undefined;
};

// Screen Props Types
export type RootStackScreenProps<T extends keyof RootStackParamList> =
    NativeStackScreenProps<RootStackParamList, T>;

export type AuthStackScreenProps<T extends keyof AuthStackParamList> =
    CompositeScreenProps<
        NativeStackScreenProps<AuthStackParamList, T>,
        RootStackScreenProps<keyof RootStackParamList>
    >;

export type MainTabScreenProps<T extends keyof MainTabParamList> =
    CompositeScreenProps<
        BottomTabScreenProps<MainTabParamList, T>,
        RootStackScreenProps<keyof RootStackParamList>
    >;

// Declaration for useNavigation hook typing
declare global {
    namespace ReactNavigation {
        interface RootParamList extends RootStackParamList { }
    }
}
