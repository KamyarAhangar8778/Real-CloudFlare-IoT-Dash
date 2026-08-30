import React from 'react';
import { VoiceCommandButtonProps } from './types';
import { useVoiceCommandHandler } from './useVoiceCommandHandler';
import VerticalVoiceButton from './VerticalVoiceButton';

export default function VoiceCommandButton(props: VoiceCommandButtonProps) {
  const handler = useVoiceCommandHandler();
  return <VerticalVoiceButton {...props} {...handler} />;
}
