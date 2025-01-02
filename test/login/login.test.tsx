// import { render, screen, fireEvent } from "@testing-library/react";
// import { useRouter } from "next/navigation";
// import { useUser } from "../../src/app/context/UserContext";
// import LoginPage from "../../src/app/login/page"; // Update this import path if necessary

// jest.mock("../../src/app/context/UserContext", () => ({
//   useUser: jest.fn(),
// }));

// jest.mock("next/navigation", () => ({
//   useRouter: jest.fn(),
// }));

// describe("LoginPage", () => {
//   let mockLogin: jest.Mock;
//   let mockPush: jest.Mock;

//   beforeEach(() => {
//     mockLogin = jest.fn();
//     mockPush = jest.fn();

//     (useUser as jest.Mock).mockReturnValue({
//       login: mockLogin,
//     });

//     (useRouter as jest.Mock).mockReturnValue({
//       push: mockPush,
//     });
//   });

//   afterEach(() => {
//     jest.clearAllMocks();
//   });

//   it("renders the login form correctly", () => {
//     render(<LoginPage />);

//     expect(screen.getByLabelText(/mail/i)).toBeInTheDocument();
//     expect(screen.getByLabelText(/pwd/i)).toBeInTheDocument();
//     expect(screen.getByRole("button", { name: /login/i })).toBeInTheDocument();
//   });

//   it("shows error message on failed login", () => {
//     mockLogin.mockReturnValue(false);

//     render(<LoginPage />);

//     fireEvent.change(screen.getByLabelText(/mail/i), { target: { value: "oussema_admin@gmail.com" } });
//     fireEvent.change(screen.getByLabelText(/pwd/i), { target: { value: "123456" } });

//     fireEvent.click(screen.getByRole("button", { name: /login/i }));

//     expect(screen.getByText(/invalid login credentials/i)).toBeInTheDocument();
//   });

//   it("redirects to dashboard on successful login", () => {
//     mockLogin.mockReturnValue(true);

//     render(<LoginPage />);

//     fireEvent.change(screen.getByLabelText(/mail/i), { target: { value: "oussema_admin@gmail.com" } });
//     fireEvent.change(screen.getByLabelText(/pwd/i), { target: { value: "123456" } });

//     fireEvent.click(screen.getByRole("button", { name: /login/i }));

//     expect(mockPush).toHaveBeenCalledWith("/dashboard");
//   });
// });



import { render, screen, fireEvent } from "@testing-library/react";
import { useRouter } from "next/navigation";
import { useUser } from "../../src/app/context/UserContext";
import LoginPage from "../../src/app/login/page";
jest.mock("next/navigation", () => ({
    useRouter: jest.fn(),
}));

jest.mock("../../src/app/context/UserContext", () => ({
    useUser: jest.fn(),
}));

describe("LoginPage", () => {
    const mockPush = jest.fn();
    const mockLogin = jest.fn();

    beforeEach(() => {
        // Mock du routeur
        (useRouter as jest.Mock).mockReturnValue({ push: mockPush });
        // Mock du contexte utilisateur
        (useUser as jest.Mock).mockReturnValue({ login: mockLogin });
        mockPush.mockClear();
        mockLogin.mockClear();
    });

    it("renders the login form", () => {
        render(<LoginPage />);
        expect(screen.getByText("Login")).toBeInTheDocument();
        expect(screen.getByLabelText("E-mail")).toBeInTheDocument();
        expect(screen.getByLabelText("Password")).toBeInTheDocument();
        expect(screen.getByText("Connection")).toBeInTheDocument();
    });

    it("shows an error message for invalid credentials", () => {
        mockLogin.mockReturnValue(false); // Simule un échec de connexion
        render(<LoginPage />);

        fireEvent.change(screen.getByLabelText("E-mail"), {
            target: { value: "oussema_admin@gmail.com" },
        });
        fireEvent.change(screen.getByLabelText("Password"), {
            target: { value: "1234567" },
        });

        fireEvent.click(screen.getByText("Login"));

        expect(screen.getByText("Incorrect email or password.")).toBeInTheDocument();
        expect(mockPush).not.toHaveBeenCalled();
    });

    it("redirects to the dashboard on successful login", () => {
        mockLogin.mockReturnValue(true); // Simule une connexion réussie
        render(<LoginPage />);

        fireEvent.change(screen.getByLabelText("E-mail"), {
            target: { value: "oussema_admin@gmail.com" },
        });
        fireEvent.change(screen.getByLabelText("Password"), {
            target: { value: "123456" },
        });

        fireEvent.click(screen.getByText("Login"));

        expect(mockPush).toHaveBeenCalledWith("/dashboard");
    });

    it("prevents submission if fields are empty", () => {
        render(<LoginPage />);

        fireEvent.click(screen.getByText("Login"));

        expect(mockLogin).not.toHaveBeenCalled();
        expect(mockPush).not.toHaveBeenCalled();
    });
});
