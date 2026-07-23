import { Button } from "./ui/Button.tsx";
import "./styles/tokens.css";

const requests = [
  { id: "REQ-1042", subject: "Cannot export report", priority: "High" },
  { id: "REQ-1041", subject: "Billing address update", priority: "Normal" },
];

export function App() {
  return (
    <main>
      <header>
        <p>Operations</p>
        <h1>Support queue</h1>
      </header>

      <ul>
        {requests.map((request) => (
          <li key={request.id}>
            <strong>{request.subject}</strong>
            <span>{request.priority}</span>
            <Button>Assign</Button>
          </li>
        ))}
      </ul>
    </main>
  );
}
