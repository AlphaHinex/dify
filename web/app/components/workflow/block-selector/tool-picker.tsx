'use client'
import type { FC } from 'react'
import React from 'react'
import { useEffect, useState } from 'react'
import {
  PortalToFollowElem,
  PortalToFollowElemContent,
  PortalToFollowElemTrigger,
} from '@/app/components/base/portal-to-follow-elem'
import type {
  OffsetOptions,
  Placement,
} from '@floating-ui/react'
import AllTools from '@/app/components/workflow/block-selector/all-tools'
import type { ToolDefaultValue } from './types'
import {
  fetchAllBuiltInTools,
  fetchAllCustomTools,
  fetchAllWorkflowTools,
} from '@/service/tools'
import type { BlockEnum, ToolWithProvider } from '@/app/components/workflow/types'
import SearchBox from '@/app/components/plugins/marketplace/search-box'
import { useTranslation } from 'react-i18next'

type Props = {
  disabled: boolean
  trigger: React.ReactNode
  placement?: Placement
  offset?: OffsetOptions
  isShow: boolean
  onShowChange: (isShow: boolean) => void
  onSelect: (tool: ToolDefaultValue) => void
  supportAddCustomTool?: boolean
}

const ToolPicker: FC<Props> = ({
  disabled,
  trigger,
  placement = 'right-start',
  offset = 0,
  isShow,
  onShowChange,
  onSelect,
  supportAddCustomTool,
}) => {
  const { t } = useTranslation()
  const [searchText, setSearchText] = useState('')

  const [buildInTools, setBuildInTools] = useState<ToolWithProvider[]>([])
  const [customTools, setCustomTools] = useState<ToolWithProvider[]>([])
  const [workflowTools, setWorkflowTools] = useState<ToolWithProvider[]>([])

  useEffect(() => {
    (async () => {
      const buildInTools = await fetchAllBuiltInTools()
      const customTools = await fetchAllCustomTools()
      const workflowTools = await fetchAllWorkflowTools()
      setBuildInTools(buildInTools)
      setCustomTools(customTools)
      setWorkflowTools(workflowTools)
    })()
  }, [])

  const handleTriggerClick = () => {
    if (disabled) return
    onShowChange(true)
  }

  const handleSelect = (_type: BlockEnum, tool?: ToolDefaultValue) => {
    onSelect(tool!)
  }

  return (
    <PortalToFollowElem
      placement={placement}
      offset={offset}
      open={isShow}
      onOpenChange={onShowChange}
    >
      <PortalToFollowElemTrigger
        onClick={handleTriggerClick}
      >
        {trigger}
      </PortalToFollowElemTrigger>

      <PortalToFollowElemContent className='z-[1000]'>
        <div className="relative w-[320px] min-h-20 rounded-xl bg-components-panel-bg-blur border-[0.5px] border-components-panel-border shadow-lg">
          <div className='p-2 pb-1'>
            <SearchBox
              search={searchText}
              onSearchChange={setSearchText}
              tags={[]}
              onTagsChange={() => { }}
              size='small'
              placeholder={t('plugin.searchTools')!}
            />
          </div>
          <AllTools
            className='mt-1'
            searchText={searchText}
            onSelect={handleSelect}
            buildInTools={buildInTools}
            customTools={customTools}
            workflowTools={workflowTools}
            supportAddCustomTool={supportAddCustomTool}
          />
        </div>
      </PortalToFollowElemContent>
    </PortalToFollowElem>
  )
}

export default React.memo(ToolPicker)