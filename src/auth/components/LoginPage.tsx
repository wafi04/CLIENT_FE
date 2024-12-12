import { Controller, useForm } from "react-hook-form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { UseLogin } from "../api/UseAuth";
import { AuthLayout } from "@/components/layouts/AuthLayout";

export interface LoginData {
  email: string;
  password: string;
  role: "admin" | "user";
}
export function LoginPage() {
  const { register, reset, handleSubmit, control } = useForm<LoginData>({
    defaultValues: {
      email: "",
      password: "",
      role: "user",
    },
  });
  const create = UseLogin();

  const onSubmit = (data: LoginData) => {
    console.log(data);
    create.mutate(data);
  };
  return (
    <AuthLayout
      title="Login"
      className="min-h-screen p-8 flex items-center justify-center bg-gray-50">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center">
            Login
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
            {/* Email */}
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                {...register("email")}
                type="email"
                placeholder="Enter your email"
                className="w-full"
              />
            </div>

            {/* Password */}
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                {...register("password")}
                type="password"
                placeholder="Enter your password"
                className="w-full"
              />
            </div>

            {/* Role Selection */}
            <div className="space-y-2">
              <Label>Role</Label>
              <Controller
                name="role"
                control={control}
                render={({ field }) => (
                  <Select onValueChange={field.onChange} value={field.value}>
                    <SelectTrigger>
                      <SelectValue placeholder="Pilih jenis kelamin" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="admin">Admin</SelectItem>
                      <SelectItem value="user">User</SelectItem>
                    </SelectContent>
                  </Select>
                )}
              />
            </div>

            <div className="flex justify-end space-x-4 pt-4">
              <Button variant="outline" type="button" onClick={() => reset()}>
                Reset
              </Button>
              <Button type="submit">Login</Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </AuthLayout>
  );
}
