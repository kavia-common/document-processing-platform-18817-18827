#!/bin/bash
cd /home/kavia/workspace/code-generation/document-processing-platform-18817-18827/intelligent_receipt_processing_frontend
npm run build
EXIT_CODE=$?
if [ $EXIT_CODE -ne 0 ]; then
   exit 1
fi

