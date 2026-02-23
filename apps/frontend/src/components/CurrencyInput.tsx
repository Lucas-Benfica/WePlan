import { useCallback, useState } from "react";
import { Input } from "antd";
import type { InputProps } from "antd";

interface CurrencyInputProps
  extends Omit<InputProps, "value" | "onChange" | "type"> {
  value?: number;
  onChange?: (value: number) => void;
}

/**
 * CurrencyInput — máscara monetária fluida (direita para esquerda).
 *
 * - Exibe sempre no formato "R$ 1.234,56"
 * - Aceita APENAS dígitos (backspace apaga)
 * - Emite o valor numérico puro (float) via `onChange`
 * - Compatível com `Form.Item` do Ant Design via `value`/`onChange`
 */
export function CurrencyInput({ value, onChange, ...rest }: CurrencyInputProps) {
  // Internal string of digits (no decimals, no dots)
  // e.g.: "150000" represents R$ 1.500,00
  const [digits, setDigits] = useState<string>(() => {
    if (!value) return "0";
    // Convert initial float value to digit string (remove separator)
    return String(Math.round(value * 100));
  });

  // Format digit string to "R$ X.XXX,XX"
  const formatDisplay = useCallback((rawDigits: string): string => {
    const num = parseInt(rawDigits || "0", 10);
    const reais = Math.floor(num / 100);
    const centavos = num % 100;
    const formatted = reais.toLocaleString("pt-BR") + "," + String(centavos).padStart(2, "0");
    return `R$ ${formatted}`;
  }, []);

  // Convert digit string to float for onChange
  const toFloat = (rawDigits: string): number => {
    const num = parseInt(rawDigits || "0", 10);
    return num / 100;
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    const key = e.key;

    if (key === "Backspace") {
      e.preventDefault();
      const next = digits.length > 1 ? digits.slice(0, -1) : "0";
      setDigits(next);
      onChange?.(toFloat(next));
      return;
    }

    if (key === "Delete") {
      e.preventDefault();
      setDigits("0");
      onChange?.(0);
      return;
    }

    if (/^\d$/.test(key)) {
      e.preventDefault();
      // Prevent leading zeros from stacking indefinitely; cap at 13 digits (R$ 9.999.999.999,99)
      const next = digits === "0" ? key : digits.length >= 13 ? digits : digits + key;
      setDigits(next);
      onChange?.(toFloat(next));
      return;
    }

    // Block everything else
    e.preventDefault();
  };

  // Sync from external value changes (form.setFieldsValue etc.)
  const displayValue = formatDisplay(
    value !== undefined ? String(Math.round(value * 100)) : digits
  );

  return (
    <Input
      {...rest}
      value={displayValue}
      onKeyDown={handleKeyDown}
      onChange={() => {}} // controlled — no native onChange
      inputMode="numeric"
      style={{ cursor: "text", ...rest.style }}
    />
  );
}
