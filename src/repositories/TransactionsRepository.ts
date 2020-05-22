import { EntityRepository, Repository } from 'typeorm';

import Transaction from '../models/Transaction';

interface Balance {
  income: number;
  outcome: number;
  total: number;
}

@EntityRepository(Transaction)
class TransactionsRepository extends Repository<Transaction> {
  public async getBalance(): Promise<Balance> {
    const transactions = await this.find();

    const { income, outcome } = transactions.reduce(
      (value, transaction) => {
        switch (transaction.type) {
          case 'income': {
            // eslint-disable-next-line no-param-reassign
            value.income += transaction.value;
            break;
          }
          case 'outcome': {
            // eslint-disable-next-line no-param-reassign
            value.outcome += transaction.value;
            break;
          }
          default:
            break;
        }

        return value;
      },
      {
        income: 0,
        outcome: 0,
        total: 0,
      },
    );

    const total = income - outcome;

    return { income, outcome, total };
  }
}

export default TransactionsRepository;
