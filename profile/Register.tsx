import React from "react";
import { View, StyleSheet } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { Layout, Button, Text, Input } from "@ui-kitten/components";
import { useForm, Controller } from "react-hook-form";

type FormData = {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
};

function Register() {
  const navigation = useNavigation();

  const { control, register, setValue, handleSubmit, errors } = useForm<
    FormData
  >();
  const onSubmit = handleSubmit(({ firstName, lastName, email, password }) => {
    console.log(firstName, lastName, email, password);
    navigation.navigate("Feed");
  });

  return (
    <Layout style={styles.background} level="3">
      <View style={styles.registerContainer}>
        <Text style={styles.header}>Register with Email</Text>
        <Controller
          control={control}
          render={({ onChange, onBlur, value }) => (
            <Input
              style={styles.inputField}
              onBlur={onBlur}
              onChangeText={(value) => onChange(value)}
              value={value}
              placeholder="First Name"
              size="large"
            />
          )}
          name="firstName"
          rules={{ required: true, pattern: /[A-Za-z]/ }}
          defaultValue=""
        />
        {errors.firstName?.type === "required" && (
          <Text style={styles.errorText}>This field is required.</Text>
        )}
        {errors.firstName?.type === "pattern" && (
          <Text style={styles.errorText}>
            Must contain alphabetical characters only.
          </Text>
        )}

        <Controller
          control={control}
          render={({ onChange, onBlur, value }) => (
            <Input
              style={styles.inputField}
              onBlur={onBlur}
              onChangeText={(value) => onChange(value)}
              value={value}
              placeholder="Last Name"
              size="large"
            />
          )}
          name="lastName"
          rules={{ required: true, pattern: /[A-Za-z]/ }}
          defaultValue=""
        />
        {errors.lastName?.type === "required" && (
          <Text style={styles.errorText}>This field is required.</Text>
        )}
        {errors.lastName?.type === "pattern" && (
          <Text style={styles.errorText}>
            Must contain alphabetical characters only.
          </Text>
        )}

        <Controller
          control={control}
          render={({ onChange, onBlur, value }) => (
            <Input
              style={styles.inputField}
              onBlur={onBlur}
              onChangeText={(value) => onChange(value)}
              value={value}
              placeholder="Email Address"
              size="large"
            />
          )}
          name="email"
          rules={{
            required: true,
            pattern: /^([a-zA-Z0-9_\-\.]+)@([a-zA-Z0-9_\-\.]+)\.([a-zA-Z]{2,5})$/,
          }}
          defaultValue=""
        />
        {errors.email?.type === "required" && (
          <Text style={styles.errorText}>This field is required.</Text>
        )}
        {errors.email?.type === "pattern" && (
          <Text style={styles.errorText}>
            Please enter a valid email address.
          </Text>
        )}

        <Controller
          control={control}
          render={({ onChange, onBlur, value }) => (
            <Input
              style={styles.inputField}
              onBlur={onBlur}
              onChangeText={(value) => onChange(value)}
              value={value}
              placeholder="Password"
              size="large"
            />
          )}
          name="password"
          rules={{ required: true, minLength: 6 }}
          defaultValue=""
        />
        {errors.password?.type === "required" && (
          <Text style={styles.errorText}>This field is required.</Text>
        )}
        {errors.password?.type === "minLength" && (
          <Text style={styles.errorText}>
            Password must be at least 6 characters.
          </Text>
        )}

        <Button
          style={styles.button}
          onPress={() => {
            onSubmit();
          }}
        >
          Register
        </Button>
      </View>
    </Layout>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
    flexDirection: "column",
  },

  button: {
    margin: 10,
  },

  errorText: {
    color: "red",
  },

  header: {
    paddingTop: 50,
    paddingHorizontal: 10,
    paddingBottom: 10,
  },

  inputField: {
    width: "100%",
    paddingHorizontal: 10,
  },

  registerContainer: {
    flex: 1,
  },
});

export default Register;
