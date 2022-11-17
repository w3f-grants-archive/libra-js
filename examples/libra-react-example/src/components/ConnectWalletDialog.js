import React, { useState, useEffect } from 'react';
import { Pane, Dialog } from 'evergreen-ui';

import SelectExtension from './ExtensionSelect';
import SelectAccount from './SelectAccount';

const Step = {
  SelectExtension: 'SelectExtension',
  SelectAccount: 'SelectAccount',
};

function AccountOption({ data }) {
  return <Pane></Pane>;
}

export default function ConnectWallet({ libra, isShown, onAccountSelected }) {
  const [currentStep, setCurrentStep] = useState(Step.SelectExtension);
  const [extensions, setExtensions] = useState([]);
  const [extensionName, setExtensionName] = useState(null);
  const [accounts, setAccounts] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const onExtensionSelected = async ({ name }) => {
    setExtensionName(name);
    const result = await libra.walletConnection.getAccounts(name);
    setAccounts(result);
    setCurrentStep(Step.SelectAccount);
    setIsLoading(false);
  };

  const handleAccountSelected = async (account) => {
    onAccountSelected && onAccountSelected({
      address: account.address,
      signer: await libra.walletConnection.getSigner(extensionName),
    })
  };

  const title = () => {
    if (currentStep === Step.SelectExtension) {
      return 'Select your wallet';
    }
    return 'Select your account';
  };

  return (
    <Dialog title={title()} isShown={isShown} hasFooter={false} hasClose={false} shouldCloseOnEscapePress={false} shouldCloseOnOverlayClick={false}>
      <Pane display="flex" width="100%">
        {currentStep === Step.SelectExtension && <SelectExtension onExtensionSelected={onExtensionSelected} />}

        {currentStep === Step.SelectAccount && (
          <SelectAccount accounts={accounts} onAccountSelected={handleAccountSelected}/>
        )}
      </Pane>
    </Dialog>
  );
}
