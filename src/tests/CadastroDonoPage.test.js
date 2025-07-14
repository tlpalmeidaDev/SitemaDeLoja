import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import CadastroDonoPage from '../pages/CadastroDonoPage';

// Testes básicos para CadastroDonoPage

describe('CadastroDonoPage', () => {
  test('renderiza campos principais', () => {
    render(<CadastroDonoPage />);
    // Verifica se todos os campos estão presentes
    expect(screen.getByLabelText(/nome completo/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/e-mail/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/telefone/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/^senha$/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/confirmação de senha/i)).toBeInTheDocument();
    // Verifica se o botão Cadastrar está presente
    expect(screen.getByRole('button', { name: /cadastrar/i })).toBeInTheDocument();
  });

  test('permite digitar nos campos do formulário', () => {
    render(<CadastroDonoPage />);
    fireEvent.change(screen.getByLabelText(/nome completo/i), { target: { value: 'João Silva' } });
    fireEvent.change(screen.getByLabelText(/e-mail/i), { target: { value: 'joao@email.com' } });
    fireEvent.change(screen.getByLabelText(/telefone/i), { target: { value: '11999999999' } });
    fireEvent.change(screen.getByLabelText(/^senha$/i), { target: { value: '123456' } });
    fireEvent.change(screen.getByLabelText(/confirmação de senha/i), { target: { value: '123456' } });
    expect(screen.getByLabelText(/nome completo/i).value).toBe('João Silva');
    expect(screen.getByLabelText(/e-mail/i).value).toBe('joao@email.com');
    expect(screen.getByLabelText(/telefone/i).value).toBe('11999999999');
    expect(screen.getByLabelText(/^senha$/i).value).toBe('123456');
    expect(screen.getByLabelText(/confirmação de senha/i).value).toBe('123456');
  });
}); 