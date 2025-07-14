import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import CadastroFuncionarioPage from '../pages/CadastroFuncionarioPage';

// Testes básicos para CadastroFuncionarioPage

describe('CadastroFuncionarioPage', () => {
  test('renderiza campos principais e dropdown de loja', () => {
    render(<CadastroFuncionarioPage />);
    // Verifica se todos os campos estão presentes
    expect(screen.getByLabelText(/nome completo/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/e-mail/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/telefone/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/loja vinculada/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/^senha$/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/confirmação de senha/i)).toBeInTheDocument();
    // Verifica se o botão Cadastrar está presente
    expect(screen.getByRole('button', { name: /cadastrar/i })).toBeInTheDocument();
    // Verifica se as opções mock do dropdown estão presentes
    expect(screen.getByText(/loja centro/i)).toBeInTheDocument();
    expect(screen.getByText(/loja bairro/i)).toBeInTheDocument();
    expect(screen.getByText(/loja shopping/i)).toBeInTheDocument();
  });

  test('permite digitar e selecionar opções do formulário', () => {
    render(<CadastroFuncionarioPage />);
    fireEvent.change(screen.getByLabelText(/nome completo/i), { target: { value: 'Maria Souza' } });
    fireEvent.change(screen.getByLabelText(/e-mail/i), { target: { value: 'maria@email.com' } });
    fireEvent.change(screen.getByLabelText(/telefone/i), { target: { value: '11988888888' } });
    fireEvent.change(screen.getByLabelText(/loja vinculada/i), { target: { value: 'loja2' } });
    fireEvent.change(screen.getByLabelText(/^senha$/i), { target: { value: 'abcdef' } });
    fireEvent.change(screen.getByLabelText(/confirmação de senha/i), { target: { value: 'abcdef' } });
    expect(screen.getByLabelText(/nome completo/i).value).toBe('Maria Souza');
    expect(screen.getByLabelText(/e-mail/i).value).toBe('maria@email.com');
    expect(screen.getByLabelText(/telefone/i).value).toBe('11988888888');
    expect(screen.getByLabelText(/loja vinculada/i).value).toBe('loja2');
    expect(screen.getByLabelText(/^senha$/i).value).toBe('abcdef');
    expect(screen.getByLabelText(/confirmação de senha/i).value).toBe('abcdef');
  });
}); 