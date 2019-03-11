import React, { useState, useEffect } from 'react'
import ReactTags from 'react-tag-autocomplete'
import classNames from 'classnames'
import { connect } from 'react-redux'

import { applyFilter } from '/store/globalReducers/ui'

const splice = (source, index) =>
	source.slice(0, index).concat(source.slice(index + 1))

function Tag ({ classNames, onDelete, tag }) {
	return (
		<div className={classNames.selectedTag}>
			<span className={classNames.selectedTagName}>{tag.name}</span>
			<button
				className="react-tags__selected-tag-button"
				onClick={onDelete}
				title="Remove this tag"
			>
				<span className="fas fa-times fa-fw" />
			</button>
		</div>
	)
}

function Filter ({ applyFilter, lastQuery }) {
	const [tags, setTags] = useState(lastQuery)

	const addTag    = tag => setTags(tags.concat(tag))
	const deleteTag = tag => setTags(splice(tags, tag))

	useEffect(() => {
		applyFilter(tags)
	}, [tags])

	return (
		<div className="card-controls p-0 mb-3">
			<div
				className={classNames('filter-input-group', {
					'filter-input-group--empty': tags.length === 0,
				})}
			>
				<span className="fas fa-search" />

				<ReactTags
					allowNew
					handleAddition={addTag}
					handleDelete={deleteTag}
					placeholder="Search for devices ..."
					tagComponent={Tag}
					tags={tags}
				/>
			</div>
		</div>
	)
}

export default connect(
	state => {
		return {
			lastQuery: state.getIn(['ui', 'filter'], []),
		}
	},
	{
		applyFilter,
	}
)(Filter)
