import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import LoginPage from '../pages/LoginPage';

// Testes básicos para LoginPage

describe('LoginPage', () => {
  test('renderiza campos principais', () => {
    render(<LoginPage />);
    // Verifica se os campos de usuário e senha estão presentes
    expect(screen.getByLabelText(/usuário/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/senha/i)).toBeInTheDocument();
    // Verifica se os radio buttons estão presentes
    expect(screen.getByLabelText(/dono/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/funcionário/i)).toBeInTheDocument();
    // Verifica se o botão Entrar está presente
    expect(screen.getByRole('button', { name: /entrar/i })).toBeInTheDocument();
    // Verifica se o link Esqueceu a senha está presente
    expect(screen.getByText(/esqueceu a senha/i)).toBeInTheDocument();
  });

  test('permite digitar nos campos de usuário e senha', () => {
    render(<LoginPage />);
    const usuarioInput = screen.getByLabelText(/usuário/i);
    const senhaInput = screen.getByLabelText(/senha/i);
    // Simula digitação
    fireEvent.change(usuarioInput, { target: { value: 'admin' } });
    fireEvent.change(senhaInput, { target: { value: '123456' } });
    expect(usuarioInput.value).toBe('admin');
    expect(senhaInput.value).toBe('123456');
  });

  test('permite trocar o tipo de usuário', () => {
    render(<LoginPage />);
    const donoRadio = screen.getByLabelText(/dono/i);
    const funcionarioRadio = screen.getByLabelText(/funcionário/i);
    // Por padrão, Dono está selecionado
    expect(donoRadio.checked).toBe(true);
    // Troca para Funcionário
    fireEvent.click(funcionarioRadio);
    expect(funcionarioRadio.checked).toBe(true);
    expect(donoRadio.checked).toBe(false);
  });
}); 