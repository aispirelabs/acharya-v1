"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import Link from "next/link";
import { toast } from "sonner";
import FormField from "@/components/FormField";
import { useRouter } from "next/navigation";

// Removed Firebase imports:
// import {
//     createUserWithEmailAndPassword,
//     signInWithEmailAndPassword,
//     sendEmailVerification,
//     reload,
//     signInWithPopup,
//     GoogleAuthProvider,
// } from "firebase/auth";
// import { auth } from "@/firebase/client"; // Firebase client setup removed

// Updated server actions (signIn and signUp now point to Django)
import { signIn, signUp, DjangoSignUpParams, DjangoSignInParams } from "@/lib/actions/auth.action";
// VerificationScreen import removed as Firebase email verification flow is removed
// import VerificationScreen from "./auth/VerificationScreen";
import AuthCard from "./auth/AuthCard";
import AuthHeader from "./auth/AuthHeader";

type FormType = "sign-in" | "sign-up";

const authFormSchema = (type: FormType) => {
    return z.object({
        // For sign-up, 'name' can be used as 'username' or split into first/last if desired.
        // Django User model requires 'username'. We'll use 'name' from form as 'username'.
        name: type === "sign-up" ? z.string().min(3, "Username must be at least 3 characters") : z.string().optional(),
        email: z.string().email("Invalid email address"),
        password: z.string().min(8, "Password must be at least 8 characters"), // Increased min length
    });
};

const AuthForm = ({ type }: { type: FormType }) => {
    const router = useRouter();
    const formSchema = authFormSchema(type);
    const [isLoading, setIsLoading] = useState(false);

    // States related to Firebase email verification and Google Sign-In are removed:
    // const [verificationSent, setVerificationSent] = useState(false);
    // const [userEmail, setUserEmail] = useState("");
    // const [isResending, setIsResending] = useState(false);
    // const [isChecking, setIsChecking] = useState(false);
    // const [isGoogleLoading, setIsGoogleLoading] = useState(false);

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: "",
            email: "",
            password: "",
        },
    });

    async function onSubmit(values: z.infer<typeof formSchema>) {
        setIsLoading(true);
        try {
            if (type === "sign-up") {
                const { name, email, password } = values;

                // Prepare params for Django signUp action
                // Assuming 'name' from form is used as 'username' for Django.
                // first_name and last_name can be added if form collects them separately.
                const signUpData: DjangoSignUpParams = {
                    username: name!, // 'name' field from form is used as username
                    email,
                    password,
                    // first_name: ..., // Optional: collect separately if needed
                    // last_name: ...,  // Optional: collect separately if needed
                };

                const result = await signUp(signUpData);

                if (!result?.success) {
                    toast.error(result?.message || "Sign up failed.");
                } else {
                    toast.success(result.message || "Account created. Please sign in.");
                    router.push("/sign-in"); // Redirect to sign-in after successful sign-up
                }
            } else { // Sign-in
                const { email, password } = values;

                // Prepare params for Django signIn action
                // Using email as username for login. Django backend needs to support this.
                // (e.g. by customizing TokenObtainPairSerializer or setting User.USERNAME_FIELD to 'email')
                const signInData: DjangoSignInParams = {
                    username: email, // Sending email as username
                    password,
                };

                const result = await signIn(signInData);

                if (!result?.success || !result.tokens) {
                    toast.error(result?.message || "Sign in failed.");
                } else {
                    // Store tokens in localStorage (client-side responsibility)
                    localStorage.setItem("access_token", result.tokens.access);
                    localStorage.setItem("refresh_token", result.tokens.refresh);

                    toast.success(result.message || "Sign in successfully.");
                    router.push("/"); // Redirect to dashboard or home page
                }
            }
        } catch (error) {
            console.error("AuthForm onSubmit error:", error);
            toast.error("An unexpected error occurred. Please try again.");
        } finally {
            setIsLoading(false);
        }
    }

    // Firebase email verification handlers (handleResendVerification, handleCheckVerification, handleBackToSignIn) removed.
    // Google Sign-In handler (handleGoogleSignIn) removed.

    const isSignIn = type === "sign-in";

    // VerificationScreen logic removed.

    return (
        <AuthCard>
            <AuthHeader title="AI-powered real-time interview platform for smarter hiring" />

            <Form {...form}>
                <form
                    onSubmit={form.handleSubmit(onSubmit)}
                    className="w-full space-y-6 mt-4 form"
                >
                    {!isSignIn && (
                        <FormField
                            control={form.control}
                            name="name" // This will be used as 'username' for Django
                            label="Username"
                            placeholder="Choose a username"
                            type="text"
                        />
                    )}

                    <FormField
                        control={form.control}
                        name="email"
                        label="Email"
                        placeholder="Your email address"
                        type="email"
                    />

                    <FormField
                        control={form.control}
                        name="password"
                        label="Password"
                        placeholder="Enter your password"
                        type="password"
                    />

                    <Button className="btn" type="submit" disabled={isLoading}>
                        {isLoading ? "Processing..." : (isSignIn ? "Sign In" : "Create an Account")}
                    </Button>
                </form>
            </Form>

            {/* Divider and Google Sign In Button removed as Google Sign-In is out of scope for this refactor */}
            {/*
            <div className="relative flex items-center justify-center mt-6 mb-4">
                <div className="absolute border-t border-gray-700 w-full"></div>
                <span className="relative px-4 bg-gray-700 text-light-300 text-sm rounded-lg">
                    or
                </span>
            </div>
            <Button ... /> // Google Sign In Button
            */}

            <p className="text-center flex flex-col sm:flex-row gap-3 justify-center mt-6">
                {isSignIn ? "No account yet?" : "Have an account already?"}
                <Link
                    href={!isSignIn ? "/sign-in" : "/sign-up"}
                    className="font-bold text-user-primary ml-1"
                >
                    {!isSignIn ? "Sign In" : "Sign Up"}
                </Link>
            </p>
        </AuthCard>
    );
};

export default AuthForm;
